# makensis-cli

[![npm](https://flat.badgen.net/npm/license/makensis-cli)](https://www.npmjs.org/package/makensis-cli)
[![npm](https://flat.badgen.net/npm/v/makensis-cli)](https://www.npmjs.org/package/makensis-cli)
[![CircleCI](https://flat.badgen.net/circleci/github/idleberg/node-makensis-cli)](https://circleci.com/gh/idleberg/node-makensis-cli)
[![David](https://flat.badgen.net/david/dep/idleberg/node-makensis-cli)](https://david-dm.org/idleberg/node-makensis-cli)
[![David](https://flat.badgen.net/david/dev/idleberg/node-makensis-cli)](https://david-dm.org/idleberg/node-makensis-cli?type=dev)

CLI for the makensis wrapper on Node

## Why?

Admittedly, there are only few reasons why you would want to use a wrapper for an already existing CLI application.

**Pros:**

- seamless [Wine](http://winehq.org/) integration
- Unix-like command-line parameters
- normalized output across different NSIS versions
- optional JSON output

**Cons:**

- redundancy

## Prerequisites

Make sure that NSIS is properly installed with `makensis` in your PATH [environmental variable](http://superuser.com/a/284351/195953).

### Windows

Download the NSIS installer from [SourceForge](https://sourceforge.net/p/nsis) and run setup. Once completed, you need to edit your environmental variable manually.

Alternatively, you can install NSIS using the [Scoop](https://github.com/NSIS-Dev/scoop-nsis) package manager:

```sh
$ scoop install nsis/nsis
```

### Linux

Install NSIS from your distribution's default package manager, for example:

```sh
# Debian
$ sudo apt-get -t experimental install nsis

# Red Hat
$ sudo dnf install nsis
```

### macOS

Install NSIS using [Homebrew](http://brew.sh/) or [MacPorts](https://www.macports.org/):

```sh
# Homebrew
$ brew install nsis

# MacPorts
$ port install nsis
```

### Wine

You can setup NSIS in your [Wine](http://winehq.org/) environment, but keep in mind that Wine writes standard streams while executing `makensis`. Additional parsing of the compiler output might be necessary.

## Installation

`$ npm install makensis-cli --global`

## Usage

You can evoke this wrapper using `mn` (for **m**ake**n**sis).

### Sub-Commands

- `hdrinfo` – prints information about what options makensis was compiled with (Aliases: `flags`)
- `version` – prints the makensis version and exits
- `license` – prints the makensis software license exits
- `cmdhelp [item]` – prints out help for 'item', or lists all commands
- `nsisdir` – prints path of `${NSISDIR}` (Aliases: `dir`)
- `scaffold` – scaffold a new NSIS script in the current working directory (Aliases: `new`)

### Options

Running `mn --help` lists all available options:

```
Usage: mn [command] [file.nsi] [options]

Options:

  -V, --version                  output the version number
  -i, --input-charset <string>   ACP|OEM|CP#|UTF8|UTF16<LE|BE>
  -j, --json                     prints output as JSON
  -W, --pause                    pauses after execution
  -o, --output-charset <string>  ACP|OEM|CP#|UTF8[SIG]|UTF16<LE|BE>[BOM]
  -P, --ppo                      preprocess to stdout/file
  -S, --safe-ppo                 safely preprocess to stdout/file
  -p, --priority <n>             process priority, where n is 5=realtime,4=high,3=above normal,2=normal,1=below normal,0=idle
  -v, --verbose <n>              verbosity where n is 4=all,3=no script,2=no info,1=no warnings,0=none
  -w, --wine                     use Wine to run makenis
  -x, --strict                   treat warnings as errors
  -h, --help                     output usage information
```

**Examples:**

Let's start with `makensis` returning its version

```sh
$ mn version

# Result:
#
# v3.02.1
```
____

We can also return this as JSON

```sh
$ mn version --json

# Result:
#
# {
#   "version": "3.02.1"
# }
```
____

Try again for `makensis` on Wine

```sh
$ mn version --json --wine

# Result:
#
# {
#   "version": "3.01"
# }
```
____

In the following steps we're going to need a demo script, so let's create one. Take special note of the `!warning` inside the section.

```sh
$ printf "OutFile demo.exe\n\nSection\n!warning\nSectionEnd" > demo.nsi
```
____

Compile the script

```sh
$ mn demo.nsi

# Result (omitted):
#
# EXE header size:               36352 / 37888 bytes
# Install code:                    399 / 1999 bytes
# Install data:                      0 / 0 bytes
# CRC (0x027F605B):                  4 / 4 bytes
# Total size:                    36755 / 39891 bytes (92.1%)
# 1 warning:
#   !warning:  (demo.nsi:4)
```
____

Compile again, but only display warnings and errors

```sh
$ mn demo.nsi --verbose 2

# Result:
#
# warning: !warning:  (demo.nsi:4)
# 1 warning:
#   !warning:  (demo.nsi:4)
```
____

Compile with strict settings, so our little `!warning` will be treated as an error.

```sh
$ mn demo.nsi --verbose 2 --strict

# Result:
#
# Exit Code 1
# Error: warning treated as error
```
____

Let's output the above as JSON

```sh
$ mn demo.nsi --verbose 2 --strict --json

# Result:
#
# {
#   "status": 1,
#   "stdout": "warning: !warning:  (demo.nsi:4)",
#   "stderr": "Error: warning treated as error",
#   "warnings": 1
# }
```

## License

This work is licensed under [The MIT License](https://opensource.org/licenses/MIT)

## Donate

You are welcome to support this project using [Flattr](https://flattr.com/submit/auto?user_id=idleberg&url=https://github.com/idleberg/node-makensis-cli) or Bitcoin `17CXJuPsmhuTzFV2k4RKYwpEHVjskJktRd`
