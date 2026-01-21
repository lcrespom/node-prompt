# node-prompt

A script that generates the full prompt. It can be setup by configuring the $PROMPT
environment variable like this:

```bash
PROMPT='$(HOST=$HOST node /PATH/TO/index.ts)'
```

The prompt settings can be configured by editing file `settings.ts`.

## Example prompt configuration script

The following script can be used in zshell and run from `~/.zshrc`:

```shell
# Use Node.js to generate a nice, colorful prompt
function node-prompt() {
  HOME=$HOME HOST=$HOST node /PATH/TO/index.ts
}

# Show a red arrow if there was an error in the previous command
PROMPT="%(?::%{$fg_bold[red]%}%1{➜ %})"
# Show the main part of the prompt (with path and git status)
PROMPT+='$(node-prompt)'
# Add a newline and custom prompt character (requires a font that supports UTF-8)
PROMPT+=$'\n'"❯ "
```
