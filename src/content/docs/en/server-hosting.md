---
title: "What server host should I pick?"
description: "What to look for in a server host"
---

When choosing a server host, be that a shared host or a dedicated server provider, you always have to think about the size of your server and how many resources you think you need. Sure, you might want to be on the latest generation of hardware that is available, but will that really matter for your 5 player server with a couple of friends?

In Minecraft Server Hosting there are three main ways of hosting you can choose from:
- Shared Hosting
- VPS
- Dedicated Servers

## Shared Hosting
Shared Hosting is a form of hosting that is provided by a game hosting company, which rents/purchases servers on which you get a small portion to use for your server, hence the ‘shared’. You will be on a physical server with other Minecraft Servers, so you will not have all the resources to yourself. These are the standard Minecraft hosts which you will most likely encounter first. On these, you can choose how much RAM you have and potentially how much CPU power and storage you get. Unlike some people’s thoughts, RAM isn’t actually the most performance-defining factor anymore. From version 1.13 and above Minecraft Servers have become way more resource-intensive thus needing way more CPU power to back it up and keep a stable 20 TPS. This is also the reason you are seeing more and more shared hosting companies moving and upgrading to newer and more modern hardware. For your small server with 5 friends this will likely not matter, but if you are running a semi - too big server you will want to make sure the CPU you choose will be able to support your server’s needs. Just be mindful of the ‘you get what you pay for’ rule, you might want to get a cheap host to support your needs, but the cheaper hosts out there will most likely not be able to support your big server. If you want to make sure that your host will be able to support your servers needs, see if you can find a host with more modern hardware, which will potentially be a bit more pricey (but worth it for your servers performance)

## VPS
A VPS, or Virtual Private Server, is a small virtual server on a bigger dedicated server. On a VPS you have complete access from which OS to use, to how you want to run your servers (be that with a web panel, or a simple SSH session with something like Screen/TMUX). The resources of a VPS are generally still shared with other customers on that same dedicated server, so if you want full access to all of the resources of a machine you will want to get a dedicated server. The benefit of a VPS is that you can run more than just your Minecraft Server, like a webserver or other tooling that requires a Linux Machine. Be wary of looking for a VPS for your Minecraft Server, as a general VPS will be running on a high core machine which is meant for something like Cloud Computing, and not for a high single-core intensive task like Minecraft. However, there are more hosts arising which are offering VPSs on high single-core performing CPU’s, thus making your Minecraft Server run a lot better than on a platform like GCP or AWS.

There are two different types of VPS: container virtualization and full virtualization. For the purpose of this guide, the main difference is that a fully virtualized VPS will have CPU cores and RAM dedicated to you alone, while container-based virtualization means you usually share CPU cores and RAM with other users, similar to shared hosting. Both types will be sold under many different names depending on the vendor. For full virtualization, look out for the keyword KVM. For container-based virtualization, look for the keyword vCores. Note that container-based is not necessarily worse - you'll usually get more performance for the same money since, in most cases, you don't need the full power of your system at the same time.

Do note that you will need some Linux knowledge to set up a VPS, think about OS installations, firewalling, etc. General best practices for security are changing your SSH port, using SSH keys, disabling root access, installing Fail2Ban and potentially limiting SSH to a known IP/VPN/JumpServer

## Dedicated Servers
Are you running a big network of servers and want to keep all of your servers on the same machine? Then a Dedicated Server is your go-to option. You can think of a Dedicated Server like your own computer, but in a big data center with lots of other similar machines that you can remotely access through an SSH client like Putty or Termius. On a Dedicated Server, you have full control over everything, which OS you want to install, how you allocate your resources and how you run your machine. Administrating a Dedicated Server is done in much the same way as with a VPS, with the main difference being performance. Next to this, you are in full control of scaling your servers as you have all the resources to yourself, which are not being shared with anyone else. If you are running a Bungee network with multiple servers then a Dedicated Server is a better option than just tying a bunch of Shared Hosting servers together.

Good Dedicated Server providers you can use (sorted on average price from low to high):
- Hetzner (EU)
- OVH (EU/AU/SEA/NA)
- ReliableSite (NA)
- PhoenixNAP (EU/NA/SEA)

Do note that you will need some Linux knowledge to set up a Dedicated Server, think about OS installations, firewalling, etc. General best practices for security are changing your SSH port, using SSH keys, disabling root access, installing Fail2Ban, and potentially limiting SSH to a known IP/VPN/JumpServer.

If you’re not familiar in this field, hiring a systems administrator to do these things for you is a possibility, though usually not free. The hiring section on Minecraft forums like SpigotMC usually has some system administrators offering their services.
