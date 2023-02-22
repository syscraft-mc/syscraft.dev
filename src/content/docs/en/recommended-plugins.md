---
title: "What plugins are recommended when starting?"
description: "A list of recommended plugins to consider using on your server"
---

The answer to this question highly depends on what type of server you are running. A semi-vanilla server will have fewer plugins than a heavily modded Towny server. Have a search on [Spigot](https://www.spigotmc.org/resources/) to see which plugins would fit your server the best.

The following are a list of commonplace, somewhat universal plugins that the SysCraft community generally recommend using. You will not need every plugin listed. Read about each one and see if it is appropriate for your needs.


## [Vault](https://www.spigotmc.org/resources/vault.34315/)
Vault is a permission, chat, & Economy API to give plugins easy hooks into these systems without needing to hook or depend on each individual plugin themselves. Most economy, chat, and permissions plugins require this API to function.

## [PlaceholderAPI](https://www.spigotmc.org/resources/placeholderapi.6245/)
PlaceholderAPI is a plugin/library that allows servers to use placeholders from a wide range of your favorite plugins collectively. It is the standard method for taking information from one plugin and displaying/using it elsewhere, such as the tab menu, chat, or scoreboards.

## [LuckPerms](https://luckperms.net) (permissions)
LuckPerms is a feature-rich, yet still incredibly easy to use permissions manager. A permissions plugin allows you to grant specific players & groups permission to either do, or specifically not do something, where something is an action or command defined in another plugin. Because most plugins use permissions in some form, a permissions plugin is almost always a requirement. LuckPerms also supports complex permission setups, works with proxy software, and has great debugging tools.

## CoreProtect or Prism (grief protection)
CoreProtect is an administration and anti-griefing tool that makes it super easy for moderators/administrators to quickly identify who broke a specific block, took an item from a chest, placed a block, lit the TNT, etc. It supports storing the log into a database, and rolling back based on configurable filters such as “rollback everything done by Notch in the last 5 minutes in this 20 block radius”. It’ll quickly become your go-to anti-grief tool.


Prism is a great similar alternative. It carries all of the same features as CoreProtect but is also an open-source alternative.

## EssentialsX (general features/management)
Essentials is a catch-all plugin for common server mechanics without having to install several individual plugins. It includes features such as shorthand/alias commands, kits, basic chat formatting, command signs, digital economy, and many more utilities. You will very likely not use everything, so sometimes heavy configuration is required.

## LiteBans (punishment management)
LiteBans is a versatile and lightweight punishment plugin supporting UUIDs that allows temporary and permanent bans, kicks, mutes, warnings, and more. It also has an easy-to-install web interface.

## AdvanceBans (punishment management)
AdvanceBans is similar to Litebans but is open source and free to anyone to use or modify. It is lightweight and supports UUIDs to ban, kick, mute, and warn. However, it does not have its own web interface you can hook up.

## WorldEdit (in-game world editor)
WorldEdit is the go-to for modifying your world or helping build large structures in Minecraft. It allows you to set, replace, and make shapes out of blocks and is to go to for helping modify large portions of your world!

## WorldGuard (world protection)
WorldGuard integrates with WorldEdit allowing you to create regions around the world and to flag them with certain characteristics (such as to deny building, mob-spawning, and more!).

## NuVotifier (vote listener)
Most server listing sites rely on voting to maintain rankings on their server list. To do this, most servers offer rewards. But in order to offer rewards, you need a plugin that listens to these server lists. That is where NuVotifier comes in. It lists on a specific port and whenever a vote is sent, it receives it and can send it to other plugins.

## VotingPlugin (vote rewards)
VotingPlugin allows you to give rewards to those that vote once the vote is received by NuVotifier.

## Chunky (world generation)
Chunky is a world pre-generator, generating new chunks quickly, efficiently, and safely. It is a much faster alternative to WorldBorder's fill function and similar features in other plugins.

## Spark (profiling tool, lag debugging)
Spark is a performance profiling plugin based on sk89q’s WarmRoast profiler. It can be used to diagnose performance issues such as lag or low tick rates.
