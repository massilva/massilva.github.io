/*global $, document, jQuery */
$(document).ready(function (jQuery) {
    'use strict';
    var commands, cmd_list, helpCommandsList, terminalName, skills, resume, name, from;

    terminalName = '[[ib;blue;black]\
    \n::::    ::::      :::     :::::::::   ::::::::   ::::::::   ::::::::  ::: \
    \n+:+:+: :+:+:+   :+: :+:   :+:    :+: :+:    :+: :+:    :+: :+:    :+: :+  \
    \n+:+ +:+:+ +:+  +:+   +:+  +:+    +:+ +:+        +:+    +:+ +:+            \
    \n+#+  +:+  +#+ +#++:++#++: +#++:++#:  +#+        +#+    +:+ +#++:++#++     \
    \n+#+       +#+ +#+     +#+ +#+    +#+ +#+        +#+    +#+        +#+     \
    \n#+#       #+# #+#     #+# #+#    #+# #+#    #+# #+#    #+# #+#    #+#     \
    \n###       ### ###     ### ###    ###  ########   ########   ########      \
    \n]';

    name = 'Marcos Antônio de Souza Silva';

    skills = [
        'C/C++: [[b;yellow;black]&#9733; &#9733; &#9733; &#9733;] [[b;white;black]&#9734;]',
        'HTML5 + CSS3: [[b;yellow;black]&#9733; &#9733; &#9733; &#9733;] [[b;white;black]&#9734;]',
        'Java: [[b;yellow;black]&#9733; &#9733; &#9733; &#9733;] [[b;white;black]&#9734;]',
        'Javascript: [[b;yellow;black]&#9733; &#9733; &#9733; &#9733;] [[b;white;black]&#9734;]',
        'Python: [[b;yellow;black]&#9733; &#9733; &#9733; &#9733;] [[b;white;black]&#9734;]',
        'D3JS: [[b;yellow;black]&#9733; &#9733; &#9733;] [[b;white;black] &#9734; &#9734;]',
        'Node: [[b;yellow;black]&#9733; &#9733; &#9733;] [[b;white;black] &#9734; &#9734;]',
        'PHP: [[b;yellow;black]&#9733; &#9733; &#9733;] [[b;white;black] &#9734; &#9734;]',
        'ReactJS: [[b;yellow;black]&#9733; &#9733;] [[b;white;black] &#9734; &#9734; &#9734;]',
    ];

    resume = 'I’m a full-stack developer who is passionate about computers.\
    \n\t\tI enjoy working on creative and challenging projects that help people in their daily lives.\
    \n\t\tAs a programmer, I’m constantly research for algorithm optimization, \
    \n\t\tbest practices and also willing to try new technologies, programming languages, tools, etc.\
    \n\t\tI like to exchange knowledge and to collaborate with teams that have good interpersonal skills.';

    from = 'Salvador/Bahia - Brazil';

    commands = {
        clear: {
            description: 'Clear the terminal screen'
        },
        guim: {
            description: 'GUI mode',
            content: function () {
                var counter = 3, self = this;
                setInterval(function () {
                    self.echo("Redirect in " + counter + " seconds...");
                    counter--;
                }, 1000);
                setTimeout(function () {
                    window.location.replace("index2.html");
                }, 3000);
            }
        },
        help: {
            description: 'Help menu'
        },
        home: {
            description: 'Welcome menu'
        },
        ls: {
            description: 'List of available commands'
        },
        name: {
            description: 'My fullname',
            content: name
        },
        resume: {
            description: "Marcos' resume",
            content: resume
        },
        skills: {
            description: 'List of Skills',
            content: skills.join('\n')
        },
        whereami: {
            description: 'Where I am',
            content: from
        },
        whoami: {
            description: 'About me',
            content: '[[b;white;black]{]\
                \n\t[[b;yellow;black]name]: "' + name + '",\
                \n\t[[b;yellow;black]resume]: "' + resume + '",\
                \n\t[[b;yellow;black]from]: "' + from + '",\
                \n\t[[b;yellow;black]skills]:{\
                \n\t\t' + skills.join('\n\t\t') + '\
                \n\t}\
                \n[[b;white;black]}]'
        }
    };
    //Store the label and description commands' list
    helpCommandsList = '';
    //List of commands separeted by white space
    cmd_list = Object.keys(commands).map(function (cmd) {
        helpCommandsList += '\n\t[[b;red;black]' + cmd + '] - ' + commands[cmd].description;
        return cmd;
    }).join(' ');
    commands.help.content = '\n\
        \nAvailable commands:\
        \n' + helpCommandsList + '\n';
    //Add content of help command
    commands.home.content = '[[ib;white;black;title]Welcome to] \
        \n' + terminalName + '\
        \n                                             [[ib;white;black;title]Curriculum] [[ib;#ccc;black]v.0.3]\
        ' + commands.help.content + '\
        \nMade with [[b;red;black] &#10084;] and jQuery Terminal (https://github.com/jcubic/jquery.terminal)\
        \n';
    // Add list of commands available
    commands.ls.content = cmd_list;
    $('body').terminal(
        function (command) {
            var content;
            if (command !== '' && commands.hasOwnProperty(command)) {
                content = commands[command].content;
                if (typeof content === 'function') {
                    content.call(this);
                } else {
                    this.echo(content);
                }
                return;
            }
            this.echo(commands.help.content);
        }, {
            greetings: commands.home.content,
            name: 'curriculum',
            prompt: '$ '
        }
    );
});
