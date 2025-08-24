/**
 * File System Component
 * Simulates a realistic file system with directories and files
 */

class FileSystem {
    constructor() {
        this.currentPath = '/home/hacker';
        this.fileStructure = {};
        this.hiddenFiles = new Set();
    }

    /**
     * Initialize the file system
     */
    async init() {
        await this.loadFileSystem();
        this.createHiddenFiles();
    }

    /**
     * Load file system structure from data
     */
    async loadFileSystem() {
        try {
            const response = await fetch('data/filesystem.json');
            if (!response.ok) {
                throw new Error('Failed to load filesystem data');
            }
            this.fileStructure = await response.json();
        } catch (error) {
            console.warn('Could not load filesystem.json, using fallback structure');
            this.createFallbackStructure();
        }
    }

    /**
     * Create fallback file structure if JSON fails to load
     */
    createFallbackStructure() {
        this.fileStructure = {
            '/': {
                type: 'directory',
                children: {
                    'home': {
                        type: 'directory',
                        children: {
                            'hacker': {
                                type: 'directory',
                                children: {
                                    'welcome.txt': {
                                        type: 'file',
                                        content: 'Welcome to the CyberHack Terminal!\n\nYour mission is to infiltrate the NEXUS Corporation database.\nUse your hacking skills to bypass security measures and extract classified data.\n\nGood luck, hacker.',
                                        size: 256
                                    },
                                    'tools': {
                                        type: 'directory',
                                        children: {
                                            'scanner.py': {
                                                type: 'file',
                                                content: '#!/usr/bin/env python3\n# Network vulnerability scanner\n\nimport socket\nimport threading\n\ndef scan_port(host, port):\n    try:\n        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\n        sock.settimeout(1)\n        result = sock.connect_ex((host, port))\n        if result == 0:\n            print(f"Port {port}: Open")\n        sock.close()\n    except:\n        pass\n\ndef main():\n    host = input("Enter target IP: ")\n    for port in range(1, 1025):\n        thread = threading.Thread(target=scan_port, args=(host, port))\n        thread.start()\n\nif __name__ == "__main__":\n    main()',
                                                contentType: 'code',
                                                size: 512
                                            },
                                            'crack.exe': {
                                                type: 'file',
                                                content: 'Binary file - Password cracking utility',
                                                executable: true,
                                                minigame: 'password',
                                                size: 2048
                                            }
                                        }
                                    },
                                    'logs': {
                                        type: 'directory',
                                        children: {
                                            'access.log': {
                                                type: 'file',
                                                content: '2024-08-10 14:32:01 - Failed login attempt from 192.168.1.100\n2024-08-10 14:32:15 - Failed login attempt from 192.168.1.100\n2024-08-10 14:32:30 - Failed login attempt from 192.168.1.100\n2024-08-10 14:33:01 - WARNING: Multiple failed attempts detected\n2024-08-10 14:35:22 - Successful login from 192.168.1.100\n2024-08-10 14:35:45 - File access: /classified/project_nexus.txt\n2024-08-10 14:36:12 - Connection terminated',
                                                size: 512
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    'var': {
                        type: 'directory',
                        children: {
                            'log': {
                                type: 'directory',
                                children: {
                                    'system.log': {
                                        type: 'file',
                                        content: 'System log entries...\n[ERROR] Unauthorized access attempt detected\n[WARNING] Firewall breach in sector 7\n[INFO] Security protocols updated',
                                        size: 1024
                                    }
                                }
                            }
                        }
                    },
                    'etc': {
                        type: 'directory',
                        children: {
                            'passwd': {
                                type: 'file',
                                content: 'root:x:0:0:root:/root:/bin/bash\nhacker:x:1000:1000:Hacker:/home/hacker:/bin/bash\nguest:x:1001:1001:Guest:/home/guest:/bin/bash',
                                permissions: 'r--r--r--',
                                size: 256
                            },
                            'hosts': {
                                type: 'file',
                                content: '127.0.0.1\tlocalhost\n192.168.1.1\trouter.local\n192.168.1.100\tnexus-server.corp\n10.0.0.1\tbackdoor.hidden',
                                size: 128
                            }
                        }
                    }
                }
            }
        };
    }

    /**
     * Create hidden files that can be discovered
     */
    createHiddenFiles() {
        this.hiddenFiles.add('/home/hacker/.bashrc');
        this.hiddenFiles.add('/home/hacker/.ssh/id_rsa');
        this.hiddenFiles.add('/var/.secret');
        this.hiddenFiles.add('/etc/.shadow');
    }

    /**
     * List directory contents
     */
    listDirectory(path) {
        const resolved = this.resolvePath(path);
        const node = this.getNode(resolved);

        if (!node) {
            return { error: `Directory not found: ${path}` };
        }

        if (node.type !== 'directory') {
            return { error: `${path} is not a directory` };
        }

        const items = [];
        
        if (node.children) {
            Object.entries(node.children).forEach(([name, child]) => {
                items.push({
                    name,
                    type: child.type,
                    size: child.size || 0,
                    permissions: child.permissions || (child.type === 'directory' ? 'rwxr-xr-x' : 'rw-r--r--'),
                    executable: child.executable || false
                });
            });
        }

        // Add hidden files if in the right directory
        this.hiddenFiles.forEach(hiddenPath => {
            const hiddenDir = hiddenPath.substring(0, hiddenPath.lastIndexOf('/'));
            if (hiddenDir === resolved) {
                const name = hiddenPath.substring(hiddenPath.lastIndexOf('/') + 1);
                items.push({
                    name,
                    type: 'file',
                    size: 256,
                    permissions: 'rw-------',
                    hidden: true
                });
            }
        });

        return { items };
    }

    /**
     * Change directory
     */
    changeDirectory(currentPath, targetPath) {
        let newPath;

        if (targetPath === '..') {
            // Go to parent directory
            if (currentPath === '/') {
                newPath = '/';
            } else {
                const parts = currentPath.split('/').filter(p => p);
                parts.pop();
                newPath = parts.length > 0 ? '/' + parts.join('/') : '/';
            }
        } else if (targetPath.startsWith('/')) {
            // Absolute path
            newPath = targetPath;
        } else {
            // Relative path
            newPath = currentPath === '/' ? `/${targetPath}` : `${currentPath}/${targetPath}`;
        }

        const resolved = this.resolvePath(newPath);
        const node = this.getNode(resolved);

        if (!node) {
            return { error: `Directory not found: ${targetPath}` };
        }

        if (node.type !== 'directory') {
            return { error: `${targetPath} is not a directory` };
        }

        return { path: resolved };
    }

    /**
     * Read file contents
     */
    readFile(currentPath, fileName) {
        const filePath = fileName.startsWith('/') ? fileName : `${currentPath}/${fileName}`;
        const resolved = this.resolvePath(filePath);
        
        // Check if it's a hidden file
        if (this.hiddenFiles.has(resolved)) {
            return this.readHiddenFile(resolved);
        }

        const node = this.getNode(resolved);

        if (!node) {
            return { error: `File not found: ${fileName}` };
        }

        if (node.type !== 'file') {
            return { error: `${fileName} is not a file` };
        }

        const result = {
            content: node.content || 'Binary file - cannot display',
            type: node.contentType || 'text',
            file: {
                name: fileName,
                path: resolved,
                size: node.size || 0,
                executable: node.executable || false
            }
        };

        // Check if file triggers a minigame
        if (node.minigame) {
            result.minigame = node.minigame;
        }

        return result;
    }

    /**
     * Read hidden file contents
     */
    readHiddenFile(path) {
        const hiddenFiles = {
            '/home/hacker/.bashrc': {
                content: '# ~/.bashrc: executed by bash for non-login shells\n\n# Alias definitions\nalias ll="ls -alF"\nalias la="ls -A"\nalias l="ls -CF"\n\n# Custom hack tools\nexport PATH=$PATH:/home/hacker/tools\n\n# Secret backdoor access\n# ssh -i ~/.ssh/id_rsa root@10.0.0.1',
                type: 'code'
            },
            '/home/hacker/.ssh/id_rsa': {
                content: '-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA7yWxQKT8/encrypted/key/data/here\n...truncated for security...\n-----END RSA PRIVATE KEY-----\n\n# This key provides access to: backdoor.hidden',
                type: 'key',
                minigame: 'ssh'
            },
            '/var/.secret': {
                content: 'CLASSIFIED INFORMATION\n=====================\n\nProject: NEXUS\nStatus: ACTIVE\nSecurity Level: MAXIMUM\n\nAccess Codes:\n- Alpha: 7F3A9B2C\n- Beta: E6D1C4A8\n- Gamma: 9A5E2F7B\n\nDatabase Location: nexus-db.corp:5432\nEncryption: AES-256',
                type: 'classified'
            },
            '/etc/.shadow': {
                content: 'root:$6$encrypted$hash:18000:0:99999:7:::\nhacker:$6$another$hash:18000:0:99999:7:::\nadmin:$6$secure$hash:18000:0:99999:7:::\nnexus:$6$topsecret$hash:18000:0:99999:7:::',
                type: 'passwords',
                minigame: 'crack'
            }
        };

        const fileData = hiddenFiles[path];
        if (!fileData) {
            return { error: 'Permission denied' };
        }

        const result = {
            content: fileData.content,
            type: fileData.type,
            file: {
                name: path.substring(path.lastIndexOf('/') + 1),
                path: path,
                size: fileData.content.length,
                hidden: true
            }
        };

        if (fileData.minigame) {
            result.minigame = fileData.minigame;
        }

        return result;
    }

    /**
     * Find files matching pattern
     */
    findFiles(pattern) {
        const results = [];
        this.searchNode('/', this.fileStructure['/'], pattern, results);
        
        // Search hidden files
        this.hiddenFiles.forEach(path => {
            if (path.includes(pattern)) {
                results.push(path);
            }
        });

        return results;
    }

    /**
     * Recursively search nodes for pattern
     */
    searchNode(path, node, pattern, results) {
        if (node.type === 'file' && node.name && node.name.includes(pattern)) {
            results.push(path);
        }

        if (node.children) {
            Object.entries(node.children).forEach(([name, child]) => {
                const childPath = path === '/' ? `/${name}` : `${path}/${name}`;
                
                if (name.includes(pattern)) {
                    results.push(childPath);
                }
                
                if (child.type === 'directory') {
                    this.searchNode(childPath, child, pattern, results);
                }
            });
        }
    }

    /**
     * Check if file exists
     */
    fileExists(currentPath, fileName) {
        const filePath = fileName.startsWith('/') ? fileName : `${currentPath}/${fileName}`;
        const resolved = this.resolvePath(filePath);
        
        return this.getNode(resolved) !== null || this.hiddenFiles.has(resolved);
    }

    /**
     * Get directory contents for auto-completion
     */
    getDirectoryContents(path) {
        const resolved = this.resolvePath(path);
        const node = this.getNode(resolved);

        if (!node || node.type !== 'directory') {
            return [];
        }

        const contents = [];
        
        if (node.children) {
            Object.keys(node.children).forEach(name => {
                contents.push(name);
            });
        }

        return contents;
    }

    /**
     * Resolve relative path to absolute path
     */
    resolvePath(path) {
        if (path === '.') {
            return this.currentPath;
        }

        if (!path.startsWith('/')) {
            path = `${this.currentPath}/${path}`;
        }

        // Normalize path (remove . and .. segments)
        const parts = path.split('/').filter(p => p && p !== '.');
        const resolved = [];

        for (const part of parts) {
            if (part === '..') {
                resolved.pop();
            } else {
                resolved.push(part);
            }
        }

        return resolved.length > 0 ? '/' + resolved.join('/') : '/';
    }

    /**
     * Get node at specified path
     */
    getNode(path) {
        if (path === '/') {
            return this.fileStructure['/'];
        }

        const parts = path.split('/').filter(p => p);
        let current = this.fileStructure['/'];

        for (const part of parts) {
            if (!current.children || !current.children[part]) {
                return null;
            }
            current = current.children[part];
        }

        return current;
    }

    /**
     * Create a new file (for dynamic content)
     */
    createFile(path, content, type = 'file') {
        const parts = path.split('/').filter(p => p);
        const fileName = parts.pop();
        const dirPath = parts.length > 0 ? '/' + parts.join('/') : '/';
        
        const dirNode = this.getNode(dirPath);
        if (!dirNode || dirNode.type !== 'directory') {
            return false;
        }

        if (!dirNode.children) {
            dirNode.children = {};
        }

        dirNode.children[fileName] = {
            type,
            content,
            size: content.length,
            created: new Date().toISOString()
        };

        return true;
    }

    /**
     * Delete a file
     */
    deleteFile(path) {
        const parts = path.split('/').filter(p => p);
        const fileName = parts.pop();
        const dirPath = parts.length > 0 ? '/' + parts.join('/') : '/';
        
        const dirNode = this.getNode(dirPath);
        if (!dirNode || dirNode.type !== 'directory' || !dirNode.children) {
            return false;
        }

        if (dirNode.children[fileName]) {
            delete dirNode.children[fileName];
            return true;
        }

        return false;
    }

    /**
     * Get file information
     */
    getFileInfo(path) {
        const resolved = this.resolvePath(path);
        const node = this.getNode(resolved);

        if (!node) {
            return null;
        }

        return {
            name: path.substring(path.lastIndexOf('/') + 1),
            path: resolved,
            type: node.type,
            size: node.size || 0,
            permissions: node.permissions || (node.type === 'directory' ? 'rwxr-xr-x' : 'rw-r--r--'),
            executable: node.executable || false,
            created: node.created || '2024-01-01T00:00:00Z',
            modified: node.modified || '2024-01-01T00:00:00Z'
        };
    }
}
