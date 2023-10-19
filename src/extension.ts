import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

const MAX_FILE_SIZE = 500 * 1024 * 1024;

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.generateReadme', () => {
        const folderPath = vscode.workspace.workspaceFolders![0].uri.fsPath;

        let usedBadges = new Set<string>();

        function checkFilesInDirectory(directory: string) {
            fs.readdirSync(directory).forEach(file => {
                const filePath = path.join(directory, file);

                if (fs.statSync(filePath).isDirectory()) {
                    checkFilesInDirectory(filePath);
                } else {
                    const ext = path.extname(file) || file;
                    if (badges[ext]) {
                        usedBadges.add(badges[ext]);
                    }

                    const fileStats = fs.statSync(filePath);
                    if (fileStats.isFile() && fileStats.size < MAX_FILE_SIZE) {
                        const fileContent = fs.readFileSync(filePath, 'utf-8');
                        detectFrameworks(fileContent, filePath).forEach(badge => {
                            usedBadges.add(badge);
                        });
                    }
                }
            });
        }

        checkFilesInDirectory(folderPath);

        const readmePath = path.join(folderPath, 'README.md');
        const writeStream = fs.createWriteStream(readmePath);

        usedBadges.forEach(badge => {
            writeStream.write(badge + '\n');
        });

        writeStream.end(() => {
            vscode.window.showInformationMessage('README.md generated!');
        });
    });

    context.subscriptions.push(disposable);
}

interface BadgeMapping {
    [key: string]: string;
}

const badges: BadgeMapping  = {
    '.py': '<img src="https://img.shields.io/badge/PYTHON-black?style=for-the-badge&logo=python&logoColor=gold"/>',
    '.js': '<img src="https://img.shields.io/badge/JAVASCRIPT-black?style=for-the-badge&logo=JavaScript&logoColor=F7DF1E"/>',
    '.ts': '<img src="https://img.shields.io/badge/TYPESCRIPT-black?style=for-the-badge&logo=TypeScript&logoColor=3178C6"/>',
	'.html': '<img src="https://img.shields.io/badge/HTML-black?style=for-the-badge&logo=HTML5&logoColor=E34F26"/>',
	'ruby': '<img src="https://img.shields.io/badge/RUBY-black?style=for-the-badge&logo=Ruby&logoColor=CC342D"/>',
    'Dockerfile': '<img src="https://img.shields.io/badge/DOCKER-black?style=for-the-badge&logo=Docker&logoColor=2496ED"/>',
    'docker-compose.yml': '<img src="https://img.shields.io/badge/DOCKER-black?style=for-the-badge&logo=Docker&logoColor=2496ED"/>',
    'docker-compose.yaml': '<img src="https://img.shields.io/badge/DOCKER-black?style=for-the-badge&logo=Docker&logoColor=2496ED"/>',
    '.gitignore': '<img src="https://img.shields.io/badge/GIT-black?style=for-the-badge&logo=GIT&logoColor=F05032"/>',
    '.gitconfig': '<img src="https://img.shields.io/badge/GIT-black?style=for-the-badge&logo=GIT&logoColor=F05032"/>',
    '.sh': '<img src="https://img.shields.io/badge/SH SCRIPTS-black?style=for-the-badge&logo=GNU Bash&logoColor=white"/>',
    '.rs': '<img src="https://img.shields.io/badge/RUST-black?style=for-the-badge&logo=RUST&logoColor=white"/>',
    '.c': '<img src="https://img.shields.io/badge/c-black?style=for-the-badge&logo=c&logoColor=A8B9CC"/>',
    '.cs': '<img src="https://img.shields.io/badge/C Sharp-black?style=for-the-badge&logo=C sharp&logoColor=512BD4"/>',
    '.cpp': '<img src="https://img.shields.io/badge/c++-black?style=for-the-badge&logo=cplusplus&logoColor=00599C"/>',
    '.css': '<img src="https://img.shields.io/badge/CSS3-black?style=for-the-badge&logo=CSS3&logoColor=1572B6"/>',
    '.dart': '<img src="https://img.shields.io/badge/Dart-black?style=for-the-badge&logo=Dart&logoColor=0175C2"/>',
    '.go': '<img src="https://img.shields.io/badge/GO-black?style=for-the-badge&logo=Go&logoColor=00ADD8"/>',
    '.java': '<img src="https://img.shields.io/badge/JAVA-black?style=for-the-badge&logo=openjdk&logoColor=F37626"/>',
    '.kt': '<img src="https://img.shields.io/badge/Kotlin-black?style=for-the-badge&logo=Kotlin&logoColor=7F52FF"/>',
    '.kts': '<img src="https://img.shields.io/badge/Kotlin-black?style=for-the-badge&logo=Kotlin&logoColor=7F52FF"/>',
    '.php': '<img src="https://img.shields.io/badge/PHP-black?style=for-the-badge&logo=PHP&logoColor=777BB4"/>',
    '.R': '<img src="https://img.shields.io/badge/R-black?style=for-the-badge&logo=R&logoColor=276DC3"/>',
    '.r': '<img src="https://img.shields.io/badge/R-black?style=for-the-badge&logo=R&logoColor=276DC3"/>',
    '.swift': '<img src="https://img.shields.io/badge/SWIFT-black?style=for-the-badge&logo=swift&logoColor=F05138"/>',
	'.scss': '<img src="https://img.shields.io/badge/SCSS-black?style=for-the-badge&logo=sass&logoColor=CC6699"/>',
	'.vue': '<img src="https://img.shields.io/badge/vue.js-black?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D"/>',
	'.tsx': '<img src="https://img.shields.io/badge/react-black?style=for-the-badge&logo=react&logoColor=61DAFB"/>',
};

function detectFrameworks(fileContent: string, filePath: string): string[] {
    const frameworks: string[] = [];

	if (filePath.endsWith('.py')) {
		if (fileContent.includes('from django.') || fileContent.includes('import django')) {
            frameworks.push('<img src="https://img.shields.io/badge/DJANGO-black?style=for-the-badge&logo=django&logoColor=white"/>');
        }
        if (fileContent.includes('import cv2')) {
            frameworks.push('<img src="https://img.shields.io/badge/OPENCV-black?style=for-the-badge&logo=opencv&logoColor=5C3EE8"/>');
        }
        if (fileContent.includes('import torch')) {
            frameworks.push('<img src="https://img.shields.io/badge/PYTORCH-black?style=for-the-badge&logo=pytorch&logoColor=EE4C2C"/>');
        }
        if (fileContent.includes('import tensorflow as tf')) {
            frameworks.push('<img src="https://img.shields.io/badge/TENSORFLOW-black?style=for-the-badge&logo=tensorflow&logoColor=FF6F00"/>');
        }
        if (fileContent.includes('from tqdm import tqdm') || fileContent.includes('import tqdm')) {
            frameworks.push('<img src="https://img.shields.io/badge/TQDM-black?style=for-the-badge&logo=TQDM&logoColor=FFC107"/>');
        }
        if (fileContent.includes('from fastapi import FastAPI') || fileContent.includes('import fastapi')) {
            frameworks.push('<img src="https://img.shields.io/badge/FASTAPI-black?style=for-the-badge&logo=fastapi&logoColor=009688"/>');
        }
        if (fileContent.includes('import numpy as np')) {
            frameworks.push('<img src="https://img.shields.io/badge/numpy-black?style=for-the-badge&logo=numpy&logoColor=white"/>');
        }
        if (fileContent.includes('import pandas as pd')) {
            frameworks.push('<img src="https://img.shields.io/badge/pandas-black?style=for-the-badge&logo=pandas&logoColor=white"/>');
        }
        if (fileContent.includes('from openai import clip')) {
            frameworks.push('<img src="https://img.shields.io/badge/OpenAI Clip-black?style=for-the-badge&logo=openai&logoColor=white"/>');
        }
        if (fileContent.includes('from flask import Flask')) {
            frameworks.push('<img src="https://img.shields.io/badge/FLASK-black?style=for-the-badge&logo=flask&logoColor=white"/>');
        }
        if (fileContent.includes('from keras.models import Sequential') || fileContent.includes('import keras')) {
            frameworks.push('<img src="https://img.shields.io/badge/KERAS-black?style=for-the-badge&logo=Keras&logoColor=D00000"/>');
        }
    }

    if (filePath.endsWith('.cs')) {
        if (fileContent.includes('using System.Web;')) {
            frameworks.push('<img src="https://img.shields.io/badge/.NET-black?style=for-the-badge&logo=dotnet&logoColor=40AEF0"/>');
        }
        if (fileContent.includes('using Xamarin;')) {
            frameworks.push('<img src="https://img.shields.io/badge/XAMARIN-black?style=for-the-badge&logo=xamarin&logoColor=3498DB"/>');
        }
        if (fileContent.includes('using UnityEngine;')) {
            frameworks.push('<img src="https://img.shields.io/badge/UNITY-black?style=for-the-badge&logo=Unity&logoColor=white"/>');
        }
    }

    if (filePath.endsWith('.java')) {
        if (fileContent.includes('import org.springframework;')) {
            frameworks.push('<img src="https://img.shields.io/badge/SPRING-black?style=for-the-badge&logo=spring&logoColor=6DB33F"/>');
        }
        if (fileContent.includes('import org.apache.struts;')) {
            frameworks.push('<img src="https://img.shields.io/badge/APACHE STRUTS-black?style=for-the-badge&logo=apache&logoColor=D22128"/>');
        }
        if (fileContent.includes('import org.hibernate;')) {
            frameworks.push('<img src="https://img.shields.io/badge/HIBERNATE-black?style=for-the-badge&logo=hibernate&logoColor=59666C"/>');
        }
    }

    if (filePath.endsWith('.cpp')) {
        if (fileContent.includes('#include <Qt')) {
            frameworks.push('<img src="https://img.shields.io/badge/QT-black?style=for-the-badge&logo=Qt&logoColor=41CD52"/>');
        }
    }

    if (filePath.endsWith('.swift')) {
        if (fileContent.includes('import Vapor')) {
            frameworks.push('<img src="https://img.shields.io/badge/VAPOR-black?style=for-the-badge&logo=vapor&logoColor=white"/>');
        }
    }

	if (filePath.endsWith('.js') || filePath.endsWith('.ts')) {
        if (fileContent.includes("import React from 'react';")) {
            frameworks.push('<img src="https://img.shields.io/badge/react-black?style=for-the-badge&logo=react&logoColor=61DAFB"/>');
        }
        if (fileContent.includes('new Vue(') || fileContent.includes("import Vue from 'vue'")) {
            frameworks.push('<img src="https://img.shields.io/badge/vue.js-black?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D"/>');
        }
		if (fileContent.includes('@Component(') || fileContent.includes('import { NgModule }')) {
			frameworks.push('<img src="https://img.shields.io/badge/angular-black?style=for-the-badge&logo=angular&logoColor=DD0031"/>');
		}
    }
    return frameworks;
}

export function deactivate() {}