import { existsSync, mkdirSync, rmSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join, resolve } from 'node:path'

const ORIGINAL_REPO = 'https://github.com/syscraft-mc/syscraft.dev.git'
const ORIGINAL_BRANCH = 'main'
const CLONE_DIR = resolve(process.cwd(), '.data', 'syscraft-mc')

// Cloudflare Pages checkouts are often shallow, so contributor lookup clones this
// repo and uses `git log --follow` on the Nuxt Content paths. That follows the
// rename from src/content/docs/en/*.mdx. The MDX path is only a fallback for
// builds from before that rename is on main.

let resolved: string | undefined

export function resolveOriginalGitDir(): string {
  if (resolved !== undefined) {
    return resolved
  }
  const fromEnv = process.env.SYSCRAFT_ORIGINAL_PATH?.trim()
  if (fromEnv) {
    const abs = resolve(fromEnv)
    if (existsSync(join(abs, '.git'))) {
      resolved = abs
      return resolved
    }
  }
  resolved = cloneOriginalRepo()
  return resolved
}

function git(args: string[], cwd?: string) {
  execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
    env: { ...process.env, GIT_TERMINAL_PROMPT: '0' }
  })
}

function cloneOriginalRepo(): string {
  try {
    if (existsSync(join(CLONE_DIR, '.git'))) {
      git(['fetch', '--quiet', 'origin', ORIGINAL_BRANCH], CLONE_DIR)
      git(['checkout', '-q', '-B', ORIGINAL_BRANCH, `origin/${ORIGINAL_BRANCH}`], CLONE_DIR)
      return CLONE_DIR
    }
    return freshClone()
  } catch {
    rmSync(CLONE_DIR, { recursive: true, force: true })
    try {
      return freshClone()
    } catch (error) {
      console.warn(
        `[syscraft] Could not clone ${ORIGINAL_REPO}; original wiki contributors will be missing.`,
        error instanceof Error ? error.message : error
      )
      return ''
    }
  }
}

function freshClone() {
  mkdirSync(resolve(CLONE_DIR, '..'), { recursive: true })
  git(['clone', '--quiet', '--single-branch', '--branch', ORIGINAL_BRANCH, ORIGINAL_REPO, CLONE_DIR])
  return CLONE_DIR
}

export function originalWikiPath(contentRelative?: string): string | undefined {
  if (!contentRelative) {
    return
  }
  const name = contentRelative.replace(/^content\//, '')
  const match = name.match(/^(?:\d+\.)?(.+)\.md$/)
  if (!match || match[1] === 'index') {
    return
  }
  return `src/content/docs/en/${match[1]}.mdx`
}
