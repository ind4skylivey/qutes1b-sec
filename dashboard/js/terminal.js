/**
 * Terminal Module for Dashboard
 * Interactive terminal with command execution
 */

import { utils } from './utils.js';

/**
 * Terminal state
 */
const terminalState = {
    history: [],
    historyIndex: -1,
    commandHistory: [],
    commandHistoryIndex: -1,
    isCommandListVisible: false,
    commandList: []
};

/**
 * Command definitions
 */
const COMMANDS = {
    help: {
        description: 'Show available commands',
        usage: 'help [command]',
        action: showHelp
    },
    clear: {
        description: 'Clear terminal output',
        usage: 'clear',
        action: clearTerminal
    },
    date: {
        description: 'Show current date and time',
        usage: 'date',
        action: showDate
    },
    whoami: {
        description: 'Display current user',
        usage: 'whoami',
        action: showWhoami
    },
    pwd: {
        description: 'Print working directory',
        usage: 'pwd',
        action: showPwd
    },
    ls: {
        description: 'List directory contents',
        usage: 'ls [options]',
        action: showLs
    },
    cat: {
        description: 'Display file contents',
        usage: 'cat [file]',
        action: showCat
    },
    echo: {
        description: 'Echo text to output',
        usage: 'echo [text]',
        action: showEcho
    },
    neofetch: {
        description: 'Display system information',
        usage: 'neofetch',
        action: showNeofetch
    },
    fortune: {
        description: 'Display random fortune',
        usage: 'fortune',
        action: showFortune
    },
    reboot: {
        description: 'Simulate system reboot',
        usage: 'reboot [time]',
        action: showReboot
    },
    shutdown: {
        description: 'Simulate system shutdown',
        usage: 'shutdown [time]',
        action: showShutdown
    },
    theme: {
        description: 'Change terminal theme',
        usage: 'theme [theme_name]',
        action: showTheme
    },
clear: {
        description: 'Clear terminal output',
        usage: 'clear',
        action: clearTerminal
    },
    theme: {
        description: 'Change terminal theme',
        usage: 'theme [theme_name]',
        action: showTheme
    }
};

/**
 * System information
 */
const SYSTEM_INFO = {
    username: 'root',
    hostname: 'qutebrowser-terminal',
    kernel: 'Linux 6.6.0-kali3-amd64',
    distro: 'Kali GNU/Linux Rolling',
    uptime: '12h 34m 56s',
    shell: 'zsh 5.9',
    cpu: 'Intel Core i7-12700K',
    ram: '16.2GB / 32GB',
    resolution: '1920x1080',
    theme: 'Dracula'
};

/**
 * Initialize terminal
 */
export function initTerminal() {
    // Setup command history
    terminalState.commandHistory = Array.from(COMMANDS.keys());

    // Setup terminal input
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    const commandSuggestions = document.getElementById('command-suggestions');
    const commandList = document.getElementById('command-list');

    if (terminalInput && terminalOutput) {
        // Focus terminal input on click
        terminalInput.addEventListener('click', () => {
            terminalInput.focus();
        });

        // Handle input
        terminalInput.addEventListener('keydown', async (e) => {
            if (e.key === 'Enter') {
                const command = terminalInput.value.trim();
                if (command) {
                    await executeCommand(command);
                    terminalInput.value = '';
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                navigateHistory(-1);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                navigateHistory(1);
            } else if (e.key === 'Tab') {
                e.preventDefault();
                if (commandSuggestions) {
                    toggleCommandSuggestions();
                }
            }
        });

        // Close suggestions on click outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#terminal') && commandSuggestions) {
                commandSuggestions.style.display = 'none';
            }
        });
    }

    // Setup command suggestions
    if (commandSuggestions && terminalInput) {
        terminalInput.addEventListener('input', (e) => {
            filterCommands(e.target.value);
        });
    }

    // Setup command list
    if (commandList) {
        commandList.addEventListener('click', (e) => {
            const command = e.target.dataset.command;
            if (command) {
                terminalInput.value = command;
                terminalInput.focus();
                if (commandSuggestions) {
                    commandSuggestions.style.display = 'none';
                }
            }
        });
    }

    // Welcome message
    setTimeout(() => {
        printWelcomeMessage();
    }, 500);
}

/**
 * Execute a command
 * @param {string} commandLine - Command line to execute
 * @returns {Promise<void>}
 */
async function executeCommand(commandLine) {
    const parts = commandLine.trim().split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Add to command history
    terminalState.commandHistory.push(commandLine);
    terminalState.commandHistoryIndex = terminalState.commandHistory.length;

    // Print command to output
    printCommand(commandLine);

    // Check if command exists
    if (!COMMANDS[command]) {
        printError(`Command not found: ${command}`);
        printHint('Type "help" to see available commands');
        return;
    }

    // Execute command
    try {
        await COMMANDS[command].action(args);
    } catch (error) {
        printError(`Error: ${error.message}`);
    }
}

/**
 * Print command to output
 * @param {string} command - Command to print
 */
function printCommand(command) {
    const terminalOutput = document.getElementById('terminal-output');
    if (terminalOutput) {
        const commandLine = document.createElement('div');
        commandLine.className = 'terminal-command text-green-400 font-mono mb-2';
        commandLine.innerHTML = `<span class="text-yellow-400">$</span> ${escapeHtml(command)}`;
        terminalOutput.appendChild(commandLine);
        scrollToBottom();
    }
}

/**
 * Print output to terminal
 * @param {string} output - Output to print
 * @param {string} type - Output type (default, error, success)
 */
function printOutput(output, type = 'default') {
    const terminalOutput = document.getElementById('terminal-output');
    if (!terminalOutput) return;

    const outputLine = document.createElement('div');
    outputLine.className = `terminal-output text-${type === 'error' ? 'red-400' : type === 'success' ? 'green-400' : 'gray-300'} font-mono mb-2 whitespace-pre-wrap break-words`;

    if (type === 'error') {
        outputLine.textContent = `Error: ${output}`;
    } else if (type === 'success') {
        outputLine.textContent = output;
    } else {
        outputLine.innerHTML = escapeHtml(output);
    }

    terminalOutput.appendChild(outputLine);
    scrollToBottom();
}

/**
 * Print error message
 * @param {string} error - Error message
 */
function printError(error) {
    printOutput(error, 'error');
}

/**
 * Print success message
 * @param {string} success - Success message
 */
function printSuccess(success) {
    printOutput(success, 'success');
}

/**
 * Print welcome message
 */
function printWelcomeMessage() {
    printOutput(`╔══════════════════════════════════════════════════════════════╗`);
    printOutput(`║           Welcome to Qutebrowser Terminal v2.0               ║`);
    printOutput(`║                  S1BGr0up Terminal System                    ║`);
    printOutput(`╚══════════════════════════════════════════════════════════════╝`);
    printOutput('');
    printOutput(`Type <span class="text-yellow-400">help</span> to see available commands.`);
    printOutput('');
}

/**
 * Show help
 * @param {Array} args - Command arguments
 */
function showHelp(args) {
    if (args.length > 0) {
        const command = args[0].toLowerCase();
        if (COMMANDS[command]) {
            printOutput(`Command: ${command.toUpperCase()}`);
            printOutput(`Description: ${COMMANDS[command].description}`);
            printOutput(`Usage: ${COMMANDS[command].usage}`);
        } else {
            printError(`Command not found: ${args[0]}`);
            printHint('Type "help" to see all commands');
        }
        return;
    }

    printOutput('Available commands:');
    printOutput('');

    for (const [command, data] of Object.entries(COMMANDS)) {
        printOutput(`  <span class="text-yellow-400">${command}</span> - ${data.description}`);
    }

    printOutput('');
    printOutput('Type <span class="text-yellow-400">help [command]</span> for more information about a specific command.');
}

/**
 * Clear terminal
 * @param {Array} args - Command arguments (unused)
 */
function clearTerminal(args) {
    const terminalOutput = document.getElementById('terminal-output');
    if (terminalOutput) {
        terminalOutput.innerHTML = '';
    }
    terminalState.isCommandListVisible = false;
    toggleCommandList();
}

/**
 * Show current date
 * @param {Array} args - Command arguments (unused)
 */
function showDate(args) {
    const now = new Date();
    printOutput(`Current date and time: ${now.toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'medium' })}`);
}

/**
 * Show current user
 * @param {Array} args - Command arguments (unused)
 */
function showWhoami(args) {
    printOutput(`Current user: ${SYSTEM_INFO.username}`);
}

/**
 * Show current directory
 * @param {Array} args - Command arguments (unused)
 */
function showPwd(args) {
    printOutput('/home/il1v3y/.config/qutebrowser/dashboard');
}

/**
 * List directory contents
 * @param {Array} args - Command arguments
 */
function showLs(args) {
    const options = args.join(' ');
    const lsOutput = [
        'components/',
        'css/',
        'data/',
        'js/',
        'index.html'
    ];

    if (options.includes('-a') || options.includes('-la')) {
        lsOutput.push('.gitignore');
    }

    printOutput(lsOutput.join('\n'));
}

/**
 * Display file contents (simulation)
 * @param {Array} args - Command arguments
 */
function showCat(args) {
    if (args.length === 0) {
        printError('Usage: cat [file]');
        return;
    }

    const file = args[0];

    // Simulate file contents
    const fileContents = {
        'readme.txt': `Qutebrowser Dashboard v2.0
========================

A cyberpunk-themed dashboard for qutebrowser.
Features:
- Multiple time zones
- System statistics
- Interactive terminal
- TODO list with localStorage
- Network visualization
- Particle effects

Developed by: S1BGr0up
Version: 2.0.0
License: MIT`,
        'license.txt': `MIT License

Copyright (c) 2026 S1BGr0up

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...`,
        'config.txt': `# Qutebrowser Dashboard Configuration
# S1BGr0up

DASHBOARD_URL = "http://localhost:9999"
ENABLE_PARTICLES = true
ENABLE_MATRIX_RAIN = true
ENABLE_CURSOR_TRAIL = true
THEME = "cyberpunk"`
    };

    if (fileContents[file]) {
        printOutput(fileContents[file]);
    } else {
        printOutput(`cat: ${file}: No such file or directory`);
    }
}

/**
 * Echo text
 * @param {Array} args - Command arguments
 */
function showEcho(args) {
    printOutput(args.join(' '));
}

/**
 * Display system information (neofetch style)
 * @param {Array} args - Command arguments (unused)
 */
function showNeofetch(args) {
    printOutput('');
    printOutput(`
   \\   \\\\       o-o
    \\   \\\\      | |
     \\   \\\\      |_|
      \\\\   \\\\  .----.
       \\\\   \\\\ (    )
        \\\\   \\\\  \"--\"
         \\\\___/
         /   \\
        /     \\
       /       \\
      /_________\\
     |___________|
`);
    printOutput(`          \\   /`);
    printOutput(`           \\ /`);
    printOutput(`            V`);
    printOutput('');
    printOutput(` <span class="text-yellow-400">${SYSTEM_INFO.username}@${SYSTEM_INFO.hostname}</span>`);
    printOutput(` ----------------`);
    printOutput(` OS: ${SYSTEM_INFO.distro}`);
    printOutput(` Kernel: ${SYSTEM_INFO.kernel}`);
    printOutput(` Uptime: ${SYSTEM_INFO.uptime}`);
    printOutput(` Shell: ${SYSTEM_INFO.shell}`);
    printOutput(` Terminal: qutebrowser`);
    printOutput(` CPU: ${SYSTEM_INFO.cpu}`);
    printOutput(` RAM: ${SYSTEM_INFO.ram}`);
    printOutput(` Theme: ${SYSTEM_INFO.theme}`);
    printOutput('');
}

/**
 * Show random fortune
 * @param {Array} args - Command arguments (unused)
 */
function showFortune(args) {
    const fortunes = [
        "The best way to predict the future is to create it.",
        "Code is like humor. When you have to explain it, it’s bad.",
        "First, solve the problem. Then, write the code.",
        "Programs must be written for people to read, and only incidentally for machines to execute.",
        "It's not a bug – it's an undocumented feature.",
        "The only way to go fast, is to go well.",
        "Premature optimization is the root of all evil.",
        "Fix the cause, not the symptom.",
        "Debugging is twice as hard as writing the code in the first place.",
        "Experience is the name everyone gives to their mistakes."
    ];

    printOutput(fortunes[Math.floor(Math.random() * fortunes.length)]);
}

/**
 * Show reboot message
 * @param {Array} args - Command arguments
 */
function showReboot(args) {
    const time = args[0] ? args[0] : 'now';
    printOutput(`System will reboot in ${time}...`);
    printOutput('Rebooting...');
    setTimeout(() => {
        printOutput('System has been rebooted successfully.');
    }, 1000);
}

/**
 * Show shutdown message
 * @param {Array} args - Command arguments
 */
function showShutdown(args) {
    const time = args[0] ? args[0] : 'now';
    printOutput(`System will shutdown in ${time}...`);
    printOutput('Shutting down...');

    setTimeout(() => {
        printOutput('System has been shutdown successfully.');
        clearTerminal([]);
    }, 1000);
}

/**
 * Show theme options
 * @param {Array} args - Command arguments
 */
function showTheme(args) {
    const themes = ['Dracula', 'Nord', 'Solarized', 'Tokyo Night', 'Catppuccin', 'Gruvbox'];

    if (args.length === 0) {
        printOutput('Available themes:');
        themes.forEach(theme => {
            printOutput(`  - ${theme}`);
        });
        return;
    }

    const theme = args[0];
    if (themes.includes(theme)) {
        printOutput(`Theme "${theme}" activated!`);
    } else {
        printError(`Theme not found: ${theme}`);
    }
}

/**
 * Escape HTML for output
 * @param {string} text - Text to escape
 * @returns {string} Escaped HTML
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Print hint
 * @param {string} hint - Hint to print
 */
function printHint(hint) {
    printOutput(`\nHint: ${hint}\n`);
}

/**
 * Navigate command history
 * @param {number} direction - Direction to navigate (1 or -1)
 */
function navigateHistory(direction) {
    const terminalInput = document.getElementById('terminal-input');
    if (!terminalInput) return;

    const newIndex = terminalState.commandHistoryIndex + direction;

    if (newIndex >= 0 && newIndex < terminalState.commandHistory.length) {
        terminalState.commandHistoryIndex = newIndex;
        terminalInput.value = terminalState.commandHistory[newIndex];
    } else if (newIndex < 0) {
        terminalState.commandHistoryIndex = -1;
        terminalInput.value = '';
    }
}

/**
 * Filter and show command suggestions
 * @param {string} query - Query string
 */
function filterCommands(query) {
    const commandSuggestions = document.getElementById('command-suggestions');
    if (!commandSuggestions) return;

    if (query.length === 0) {
        commandSuggestions.style.display = 'none';
        return;
    }

    const filteredCommands = Object.entries(COMMANDS)
        .filter(([name, _]) => name.startsWith(query.toLowerCase()))
        .map(([name, data]) => ({
            name,
            description: data.description,
            usage: data.usage
        }));

    if (filteredCommands.length === 0) {
        commandSuggestions.style.display = 'none';
        return;
    }

    commandSuggestions.style.display = 'block';
    commandSuggestions.innerHTML = filteredCommands.map(cmd => `
        <div class="p-2 hover:bg-gray-700 cursor-pointer flex justify-between" data-command="${escapeHtml(cmd.name)}">
            <span class="text-yellow-400 font-mono">${escapeHtml(cmd.name)}</span>
            <span class="text-gray-400 text-sm">${escapeHtml(cmd.description)}</span>
        </div>
    `).join('');
}

/**
 * Toggle command suggestions panel
 */
function toggleCommandSuggestions() {
    const commandSuggestions = document.getElementById('command-suggestions');
    if (!commandSuggestions) return;

    commandSuggestions.style.display = commandSuggestions.style.display === 'block' ? 'none' : 'block';
}

/**
 * Toggle command list
 */
function toggleCommandList() {
    const commandList = document.getElementById('command-list');
    if (!commandList) return;

    terminalState.isCommandListVisible = !terminalState.isCommandListVisible;

    if (terminalState.isCommandListVisible) {
        commandList.style.display = 'block';
        commandList.innerHTML = Object.entries(COMMANDS).map(([name, data]) => `
            <div class="p-2 hover:bg-gray-700 cursor-pointer flex justify-between" data-command="${escapeHtml(name)}">
                <span class="text-yellow-400 font-mono">${escapeHtml(name)}</span>
                <span class="text-gray-400 text-sm">${escapeHtml(data.description)}</span>
            </div>
        `).join('');
    } else {
        commandList.style.display = 'none';
    }
}

/**
 * Scroll terminal to bottom
 */
function scrollToBottom() {
    const terminalOutput = document.getElementById('terminal-output');
    if (terminalOutput) {
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
}

// Initialize terminal when module is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTerminal);
} else {
    initTerminal();
}
