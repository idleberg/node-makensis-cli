# makensis-cli

[![npm](https://img.shields.io/npm/l/makensis-cli.svg?style=flat-square)](https://www.npmjs.org/package/makensis-cli)
[![npm](https://img.shields.io/npm/v/makensis-cli.svg?style=flat-square)](https://www.npmjs.org/package/makensis-cli)
[![Travis](https://img.shields.io/travis/idleberg/node-makensis-cli.svg?style=flat-square)](https://travis-ci.org/idleberg/node-makensis-cli)
[![David](https://img.shields.io/david/idleberg/node-makensis-cli.svg?style=flat-square)](https://david-dm.org/idleberg/node-makensis-cli)
[![David](https://img.shields.io/david/dev/idleberg/node-makensis-cli.svg?style=flat-square)](https://david-dm.org/idleberg/node-makensis-cli?type=dev)

CLI for the makensis wrapper on Node

## Why?

Admittedly, there are only few reasons why you would want to use a wrapper for an already existing CLI application.

**Pros:**

- seamless [Wine](http://winehq.org/) integration
- Unix-like command-line parameters
- JSON output

**Cons:**

- redundancy

## Prerequisites

Make sure that NSIS is properly installed with `makensis` in your PATH [environmental variable](http://superuser.com/a/284351/195953).

On non-Windows platforms, you can usually install NSIS with your package manager:

```sh
# Debian
sudo apt-get install nsis

# Red Hat
sudo dnf install nsis

# Homebrew
brew install nsis

# MacPorts
port install nsis
```

Alternatively, you can setup NSIS in your [Wine](http://winehq.org/) environment. Keep in mind that Wine writes standard streams while running `makensis`, so additional parsing of the compiler output might be necessary.

## Installation

`$ npm install makensis-cli --global`

## Usage

### Commands

- `compile <file.nsi>` – compiles provided script (Aliases: `c|build|make` )
- `hdrinfo` – prints information about what options makensis was compiled with (Aliases: `f|flags|i|info`)
- `version` – prints the makensis version and exits (Alias: `v`)
- `cmdhelp [item]` – prints out help for 'item', or lists all commands (Aliases: `h|help`)

### Options

**Note:** The following examples use the package name `makensis-cli` as command. However, the script is also linked against the much shorter `nsis`!

Running `makensis-cli help` lists all available options:

```
Usage: makensis-cli <command> [file.nsi] [options]

Options:

  -V, --version                 output the version number
  -i, --input-charset <string>  ACP|OEM|CP#|UTF8|UTF16[LE|BE]
  -j, --json                    print hdrinfo as JSON
  -p, --pause                   pauses after execution
  -P, --ppo                     preprocess to stdout/file
  -S, --safe-ppo                preprocess to stdout/file
  -v, --verbose <n>             verbosity where n is 4=all,3=no script,2=no info,1=no warnings,0=none
  -w, --wine                    use Wine to run makenis
  -x, --strict                  treat warnings as errors
  -h, --help                    output usage information
```

**Examples:**

Let's start with `makensis` returning its version

```sh
$ makensis-cli version

# Result:
#
# v3.02.1
```
____

We can also return this as JSON

```sh
$ makensis-cli version --json

# Result:
#
# {
#   "version": "3.02.1"
# }
```
____

Try again for `makensis` on Wine

```sh
$ makensis-cli version --json --wine

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
$ makensis-cli compile demo.nsi

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
$ makensis-cli compile demo.nsi --verbose 2

# Result:
#
# warning: !warning:  (demo.nsi:4)
# 1 warning:
#   !warning:  (demo.nsi:4)
```
____

Complie with strict settings, so our little `!warning` will be treated as an error.

```sh
$ makensis-cli compile demo.nsi --verbose 2 --strict

# Result:
#
# Exit Code 1
# Error: warning treated as error
```
____

Let's output the above as JSON

```sh
$ makensis-cli compile demo.nsi --verbose 2 --strict --json

# Result:
#
# {
#   "status": 1,
#   "stdout": "warning: !warning:  (demo.nsi:4)",
#   "stderr": "Error: warning treated as error"
# }
```
## License

This work is licensed under [The MIT License](https://opensource.org/licenses/MIT)

## Donate

You are welcome support this project using [Flattr](https://flattr.com/submit/auto?user_id=idleberg&url=https://github.com/idleberg/node-makensis-cli) or Bitcoin `17CXJuPsmhuTzFV2k4RKYwpEHVjskJktRd`
