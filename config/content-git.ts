import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { originalWikiPath, resolveOriginalGitDir } from './original-git'

export interface ContentContributor {
  name: string
  username?: string
  avatar?: string
}

const GITHUB_NOREPLY = /^(?:\d+\+)?([A-Za-z0-9-]+)@users\.noreply\.github\.com$/i

const KNOWN_EMAILS: Record<string, { username: string, name: string }> = {
  'hey@laarryy.dev': { username: 'Laarryy', name: 'Larry' },
  'larrydblomme@hotmail.com': { username: 'Laarryy', name: 'Larry' },
  'sam@goodger.dev': { username: 'Turbotailz', name: 'Sam Goodger' },
  'sam@goodger.nz': { username: 'Turbotailz', name: 'Sam Goodger' },
  'turbo@tailz.dev': { username: 'Turbotailz', name: 'Sam Goodger' },
  'harry@harryw.link': { username: 'hwalker928', name: 'Harry W' },
  'mnmiller1@me.com': { username: 'me4502', name: 'Maddy Miller' },
  'bendhull5@gmail.com': { username: 'Tikkle', name: 'Tikkle' }
}

const KNOWN_NAMES: Record<string, { username: string, name: string }> = {
  'larry': { username: 'Laarryy', name: 'Larry' },
  'sam goodger': { username: 'Turbotailz', name: 'Sam Goodger' },
  'turbotailz': { username: 'Turbotailz', name: 'Sam Goodger' },
  'notgeri': { username: 'NotGeri', name: 'NotGeri' },
  'harry w': { username: 'hwalker928', name: 'Harry W' },
  'maddy miller': { username: 'me4502', name: 'Maddy Miller' },
  'tikkle': { username: 'Tikkle', name: 'Tikkle' },
  'powercas_gamer': { username: 'powercasgamer', name: 'powercas_gamer' },
  'powercasgamer': { username: 'powercasgamer', name: 'powercas_gamer' }
}

interface PersonCount {
  name: string
  username?: string
  commits: number
}

const EDIT_REPO = 'https://github.com/syscraft-mc/syscraft.dev'
const EDIT_BRANCH = 'main'

let dates: Map<string, string> | null = null
let contributors: Map<string, ContentContributor[]> | null = null

export function contentRelative(filePath?: string): string | undefined {
  if (!filePath) {
    return
  }
  const normalized = filePath.replaceAll('\\', '/')
  const idx = normalized.lastIndexOf('/content/')
  if (idx !== -1) {
    return normalized.slice(idx + 1)
  }
  if (normalized.startsWith('content/')) {
    return normalized
  }
  if (normalized.endsWith('.md') && !normalized.includes('/')) {
    return `content/${normalized}`
  }
  return `content/${normalized.replace(/^\.\//, '')}`
}

function loadContentGitDates(repoRoot: string): Map<string, string> {
  if (dates) {
    return dates
  }
  const next = new Map<string, string>()
  if (!repoRoot || !existsSync(resolve(repoRoot, '.git'))) {
    dates = next
    return next
  }
  try {
    const output = execFileSync('git', ['log', '--pretty=format:COMMIT:%cI', '--name-only', '--', 'content'], {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    })
    let current: string | undefined
    for (const line of output.split('\n')) {
      if (line.startsWith('COMMIT:')) {
        current = line.slice('COMMIT:'.length)
        continue
      }
      const file = line.trim()
      if (!file || !current || next.has(file)) {
        continue
      }
      next.set(file, current)
    }
  } catch {
    dates = new Map()
    return dates
  }
  dates = next
  return next
}

function laterDate(a?: string, b?: string): string | undefined {
  if (!a) {
    return b
  }
  if (!b) {
    return a
  }
  return Date.parse(a) >= Date.parse(b) ? a : b
}

function gitPathExists(repoRoot: string, rel: string) {
  try {
    execFileSync('git', ['cat-file', '-e', `HEAD:${rel}`], {
      cwd: repoRoot,
      stdio: 'ignore'
    })
    return true
  } catch {
    return false
  }
}

function followedPaths(repoRoot: string, rel: string): string[] {
  if (!repoRoot || !rel) {
    return []
  }
  try {
    const output = execFileSync('git', ['log', '--follow', '--name-only', '--pretty=format:', '--', rel], {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    })
    return [...new Set(output.split('\n').map(line => line.trim()).filter(Boolean))]
  } catch {
    return []
  }
}

function latestCommitDate(repoRoot: string, rel: string): string | undefined {
  try {
    const date = execFileSync('git', ['log', '-1', '--follow', '--pretty=format:%cI', '--', rel], {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim()
    return date || undefined
  } catch {
    return
  }
}

function historyIncludesOriginal(repoRoot: string, rel: string, originalRel?: string) {
  return Boolean(originalRel && followedPaths(repoRoot, rel).includes(originalRel))
}

function originalFileUpdatedAt(filePath?: string): string | undefined {
  const originalDir = resolveOriginalGitDir()
  const rel = contentRelative(filePath)
  if (!originalDir || !rel) {
    return
  }
  if (gitPathExists(originalDir, rel)) {
    const followed = latestCommitDate(originalDir, rel)
    if (followed) {
      return followed
    }
  }
  const originalRel = originalWikiPath(rel)
  return originalRel ? latestCommitDate(originalDir, originalRel) : undefined
}

export function contentFileUpdatedAt(repoRoot: string, filePath?: string): string | undefined {
  const key = contentRelative(filePath)
  const current = key && repoRoot ? loadContentGitDates(repoRoot).get(key) : undefined
  if (current && key && historyIncludesOriginal(repoRoot, key, originalWikiPath(key))) {
    return current
  }
  return laterDate(current, originalFileUpdatedAt(filePath))
}

function isBot(name: string, email: string, username?: string) {
  const hay = `${name} ${email} ${username || ''}`.toLowerCase()
  return hay.includes('[bot]')
    || email === 'noreply@github.com'
    || name === 'GitHub'
    || name === 'web-flow'
}

function contributorIdentity(name: string, email: string): { key: string, name: string, username?: string } {
  const trimmedName = name.trim()
  const normalizedEmail = email.trim().toLowerCase()
  const knownEmail = KNOWN_EMAILS[normalizedEmail]
  if (knownEmail) {
    return { key: knownEmail.username.toLowerCase(), ...knownEmail }
  }
  const noreply = normalizedEmail.match(GITHUB_NOREPLY)
  const noreplyUser = noreply?.[1]
  if (noreplyUser) {
    return {
      key: noreplyUser.toLowerCase(),
      username: noreplyUser,
      name: trimmedName || noreplyUser
    }
  }
  const knownName = KNOWN_NAMES[trimmedName.toLowerCase()]
  if (knownName) {
    return { key: knownName.username.toLowerCase(), ...knownName }
  }
  return {
    key: normalizedEmail || trimmedName.toLowerCase(),
    name: trimmedName
  }
}

function authorsFromLog(output: string): PersonCount[] {
  const counts = new Map<string, PersonCount>()
  for (const line of output.split('\n')) {
    const tab = line.indexOf('\t')
    if (tab === -1) {
      continue
    }
    const name = line.slice(0, tab)
    const email = line.slice(tab + 1)
    const identity = contributorIdentity(name, email)
    if (!identity.key || isBot(identity.name, email, identity.username)) {
      continue
    }
    const current = counts.get(identity.key)
    if (current) {
      current.commits += 1
      if (!current.username && identity.username) {
        current.username = identity.username
        current.name = identity.name
      }
      continue
    }
    counts.set(identity.key, {
      name: identity.name,
      username: identity.username,
      commits: 1
    })
  }
  return [...counts.values()]
}

function gitAuthorsForFile(repoRoot: string, rel: string): PersonCount[] {
  if (!repoRoot || !rel) {
    return []
  }
  try {
    const output = execFileSync('git', ['log', '--follow', '--pretty=format:%aN\t%aE', '--', rel], {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    })
    return authorsFromLog(output)
  } catch {
    return []
  }
}

function mergePeople(...lists: PersonCount[][]): ContentContributor[] {
  const merged = new Map<string, PersonCount>()
  for (const person of lists.flat()) {
    const nameKey = (person.username || person.name).toLowerCase().replace(/[^a-z0-9]/g, '')
    const current = merged.get(nameKey)
    if (!current) {
      merged.set(nameKey, { ...person })
      continue
    }
    current.commits += person.commits
    if (!current.username && person.username) {
      current.username = person.username
      current.name = person.name
    }
  }
  return [...merged.values()]
    .sort((a, b) => b.commits - a.commits || a.name.localeCompare(b.name))
    .map(({ name, username }) => ({
      name,
      ...(username
        ? { username, avatar: `https://github.com/${username}.png?size=80` }
        : {})
    }))
}

function contributorsForFile(repoRoot: string, rel: string): ContentContributor[] {
  const originalRel = originalWikiPath(rel)
  const localAuthors = gitAuthorsForFile(repoRoot, rel)
  if (historyIncludesOriginal(repoRoot, rel, originalRel)) {
    return mergePeople(localAuthors)
  }

  const originalDir = resolveOriginalGitDir()
  if (!originalDir || !originalRel) {
    return mergePeople(localAuthors)
  }

  if (gitPathExists(originalDir, rel) && historyIncludesOriginal(originalDir, rel, originalRel)) {
    return mergePeople(localAuthors, gitAuthorsForFile(originalDir, rel))
  }

  return mergePeople(localAuthors, gitAuthorsForFile(originalDir, originalRel))
}

function markdownFilesUnderContent(repoRoot: string): string[] {
  const root = join(repoRoot, 'content')
  if (!existsSync(root)) {
    return []
  }
  const files: string[] = []
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(full)
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(relative(repoRoot, full).replaceAll('\\', '/'))
      }
    }
  }
  walk(root)
  return files
}

function loadContentContributors(repoRoot: string): Map<string, ContentContributor[]> {
  if (contributors) {
    return contributors
  }
  const next = new Map<string, ContentContributor[]>()
  if (!repoRoot || !existsSync(resolve(repoRoot, '.git'))) {
    contributors = next
    return next
  }
  for (const rel of markdownFilesUnderContent(repoRoot)) {
    next.set(rel, contributorsForFile(repoRoot, rel))
  }
  contributors = next
  return next
}

export function contentFileMtime(repoRoot: string, filePath?: string): string | undefined {
  const key = contentRelative(filePath)
  if (!repoRoot || !key) {
    return
  }
  try {
    return statSync(join(repoRoot, key)).mtime.toISOString()
  } catch {
    return
  }
}

export function contentWorkingTreeAuthor(repoRoot: string): ContentContributor[] {
  if (!repoRoot) {
    return []
  }
  let name: string
  let email: string
  try {
    name = execFileSync('git', ['config', 'user.name'], {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim()
    email = execFileSync('git', ['config', 'user.email'], {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim()
  } catch {
    return []
  }
  const identity = contributorIdentity(name, email)
  if (!identity.key || isBot(identity.name, email, identity.username)) {
    return []
  }
  return [{
    name: identity.name,
    ...(identity.username
      ? { username: identity.username, avatar: `https://github.com/${identity.username}.png?size=80` }
      : {})
  }]
}

export function contentFileContributors(repoRoot: string, filePath?: string): ContentContributor[] {
  if (!repoRoot) {
    return []
  }
  const key = contentRelative(filePath)
  return key ? (loadContentContributors(repoRoot).get(key) || []) : []
}

export function contentEditUrl(relativePath: string, branch = EDIT_BRANCH, repo = EDIT_REPO): string {
  return `${repo}/edit/${branch}/${relativePath}`
}
