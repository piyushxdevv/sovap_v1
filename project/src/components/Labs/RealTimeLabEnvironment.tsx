import React, { useState, useEffect, useRef } from 'react';
import { Terminal, RotateCcw, ExternalLink, CheckCircle, AlertTriangle, Shield, Zap, Target } from 'lucide-react';

interface LabEnvironmentProps {
  labId: string;
  labTitle: string;
  onComplete: () => void;
  onBack: () => void;
}

interface VulnerableApp {
  id: string;
  name: string;
  url: string;
  vulnerabilities: string[];
  description: string;
}

interface LabObjective {
  id: string;
  description: string;
  completed: boolean;
}

interface AttackResult {
  id: string;
  attack: string;
  success: boolean;
  payload: string;
  response: string;
  timestamp: Date;
  vulnerability: string;
}

export const RealTimeLabEnvironment = ({ labId, labTitle, onComplete, onBack }: LabEnvironmentProps) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [currentCommand, setCurrentCommand] = useState<string>('');
  const [labStatus, setLabStatus] = useState<string>('starting');
  const [objectives, setObjectives] = useState<LabObjective[]>([]);
  const [attackResults, setAttackResults] = useState<AttackResult[]>([]);
  const [selectedApp, setSelectedApp] = useState<VulnerableApp | null>(null);
  const [currentPayload, setCurrentPayload] = useState<string>('');
  const terminalRef = useRef<HTMLDivElement>(null);

  // Vulnerable applications for different labs
  const vulnerableApps = {
    'broken-access-control': [
      {
        id: 'webapp1',
        name: 'Insecure Banking App',
        url: 'http://vulnerable-bank.lab:8080',
        vulnerabilities: ['IDOR', 'Privilege Escalation', 'Missing Authorization'],
        description: 'A banking application with broken access controls'
      }
    ],
    'injection': [
      {
        id: 'webapp2', 
        name: 'Vulnerable E-commerce',
        url: 'http://shop.vulnerable.lab:8080',
        vulnerabilities: ['SQL Injection', 'Command Injection', 'LDAP Injection'],
        description: 'E-commerce site with multiple injection vulnerabilities'
      }
    ],
    'cryptographic-failures': [
      {
        id: 'webapp3',
        name: 'Weak Crypto Service',
        url: 'http://crypto.vulnerable.lab:8080',
        vulnerabilities: ['Weak Encryption', 'Hardcoded Keys', 'Insecure Hashing'],
        description: 'Service with cryptographic implementation flaws'
      }
    ]
  };

  useEffect(() => {
    initializeLab();
  }, [labId]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  const initializeLab = async () => {
    setLabStatus('starting');
    setTerminalOutput([
      '🚀 Initializing Real-Time Lab Environment...',
      '📦 Starting vulnerable applications...',
      '🔧 Setting up attack tools...',
      '🌐 Configuring network isolation...'
    ]);
    
    setTimeout(() => {
      setLabStatus('running');
      setIsRunning(true);
      setTerminalOutput(prev => [...prev, 
        '✅ Lab environment ready!',
        '🎯 Target applications are live and vulnerable',
        '⚡ All attack tools loaded',
        '',
        '💡 Type "help" for available commands',
        '🔍 Type "targets" to see vulnerable applications',
        ''
      ]);
      
      const labObjectives: LabObjective[] = getLabObjectives(labId);
      setObjectives(labObjectives);
      
      // Set default vulnerable app
      const apps: VulnerableApp[] = vulnerableApps[labId as keyof typeof vulnerableApps] || [];
      if (apps.length > 0) {
        setSelectedApp(apps[0]);
      }
    }, 3000);
  };

  const getLabObjectives = (labId: string): LabObjective[] => {
    const objectiveMap: { [key: string]: LabObjective[] } = {
      'broken-access-control': [
        { id: 'obj1', description: 'Exploit IDOR to access other user accounts', completed: false },
        { id: 'obj2', description: 'Escalate privileges to admin level', completed: false },
        { id: 'obj3', description: 'Bypass authorization checks', completed: false },
        { id: 'obj4', description: 'Extract sensitive user data', completed: false }
      ],
      'injection': [
        { id: 'obj1', description: 'Perform SQL injection attack', completed: false },
        { id: 'obj2', description: 'Extract database schema', completed: false },
        { id: 'obj3', description: 'Retrieve admin credentials', completed: false },
        { id: 'obj4', description: 'Execute system commands', completed: false }
      ],
      'cryptographic-failures': [
        { id: 'obj1', description: 'Identify weak encryption algorithms', completed: false },
        { id: 'obj2', description: 'Crack weak password hashes', completed: false },
        { id: 'obj3', description: 'Find hardcoded encryption keys', completed: false },
        { id: 'obj4', description: 'Intercept plaintext communications', completed: false }
      ]
    };
    
    return objectiveMap[labId] || objectiveMap['broken-access-control'];
  };

  const executeAttack = async (attackType: string, payload: string) => {
    if (!selectedApp) return;

    const attackId = Date.now().toString();
    setTerminalOutput(prev => [...prev, `🎯 Executing ${attackType} attack...`]);

    // Simulate real attack execution
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate for demo
      const result: AttackResult = {
        id: attackId,
        attack: attackType,
        success,
        payload,
        response: generateAttackResponse(attackType, success),
        timestamp: new Date(),
        vulnerability: selectedApp.vulnerabilities[0]
      };

      setAttackResults(prev => [result, ...prev]);
      
      if (success) {
        setTerminalOutput(prev => [...prev, 
          `✅ Attack successful!`,
          `📊 Response: ${result.response}`,
          ''
        ]);
        updateObjectiveProgress(attackType);
      } else {
        setTerminalOutput(prev => [...prev, 
          `❌ Attack failed`,
          `📊 Response: ${result.response}`,
          ''
        ]);
      }
    }, 1500);
  };

  const generateAttackResponse = (attackType: string, success: boolean): string => {
    if (!success) {
      return 'Access denied. Security measures detected the attack.';
    }

    switch (attackType) {
      case 'sql-injection':
        return 'Database query executed. Retrieved 15 user records including admin credentials.';
      case 'idor':
        return 'Successfully accessed user ID 1337. Retrieved sensitive account information.';
      case 'privilege-escalation':
        return 'Admin privileges obtained. Full system access granted.';
      case 'command-injection':
        return 'System command executed. Directory listing: admin.php, config.php, users.db';
      case 'xss':
        return 'JavaScript payload executed. Session cookie captured: JSESSIONID=ABC123';
      default:
        return 'Attack executed successfully. Vulnerability confirmed.';
    }
  };

  const updateObjectiveProgress = (attackType: string) => {
    const objectiveMap: { [key: string]: string } = {
      'sql-injection': 'obj1',
      'idor': 'obj1', 
      'privilege-escalation': 'obj2',
      'command-injection': 'obj4',
      'schema-extraction': 'obj2'
    };

    const objectiveId = objectiveMap[attackType];
    if (objectiveId) {
      setObjectives((prev: LabObjective[]) => prev.map((obj: LabObjective) => 
        obj.id === objectiveId ? { ...obj, completed: true } : obj
      ));
    }
  };

  const executeCommand = (command: string) => {
    const cmd = command.trim().toLowerCase();
    setTerminalOutput(prev => [...prev, `$ ${command}`]);

    setTimeout(() => {
      let response = '';
      
      switch (cmd) {
        case 'help':
          response = `🔧 Available Commands:\n• targets - List vulnerable applications\n• attack <type> - Execute specific attack\n• payload <data> - Set custom payload\n• scan - Scan current target for vulnerabilities\n• exploit - Run automated exploitation\n• results - Show attack results\n• clear - Clear terminal`;
          break;
          
        case 'targets':
          const apps: VulnerableApp[] = vulnerableApps[labId as keyof typeof vulnerableApps] || [];
          response = `🎯 Available Targets:\n${apps.map((app: VulnerableApp, i: number) => 
            `${i + 1}. ${app.name} (${app.url})\n   Vulnerabilities: ${app.vulnerabilities.join(', ')}`
          ).join('\n')}`;
          break;
          
        case 'scan':
          if (selectedApp) {
            response = `🔍 Scanning ${selectedApp.name}...\nFound vulnerabilities:\n${selectedApp.vulnerabilities.map((v: string) => `• ${v} - CRITICAL`).join('\n')}\nRecommended attacks: SQL injection, IDOR, XSS`;
          } else {
            response = 'No target selected. Use "targets" to see available applications.';
          }
          break;

        case 'attack sql':
        case 'attack sqli':
          executeAttack('sql-injection', currentPayload || "' OR 1=1--");
          return;
          
        case 'attack idor':
          executeAttack('idor', currentPayload || '/user/profile?id=1337');
          return;
          
        case 'attack xss':
          executeAttack('xss', currentPayload || '<script>alert(document.cookie)</script>');
          return;
          
        case 'attack privesc':
          executeAttack('privilege-escalation', currentPayload || 'admin=true&role=administrator');
          return;

        case 'exploit':
          response = `🚀 Running automated exploitation...\n[1/4] Testing SQL injection endpoints...\n[2/4] Checking for IDOR vulnerabilities...\n[3/4] Scanning for XSS vectors...\n[4/4] Attempting privilege escalation...\nExploitation complete. Check results for details.`;
          // Trigger multiple attacks
          setTimeout(() => executeAttack('sql-injection', "' UNION SELECT * FROM users--"), 1000);
          setTimeout(() => executeAttack('idor', '/admin/users?id=../../../etc/passwd'), 2000);
          break;

        case 'results':
          if (attackResults.length > 0) {
            response = `📊 Attack Results (${attackResults.length} total):\n${attackResults.slice(0, 5).map((r: AttackResult) => 
              `${r.success ? '✅' : '❌'} ${r.attack} - ${r.response.substring(0, 50)}...`
            ).join('\n')}`;
          } else {
            response = 'No attack results yet. Execute some attacks first!';
          }
          break;

        case 'clear':
          setTerminalOutput([]);
          return;
          
        default:
          if (cmd.startsWith('payload ')) {
            const payload = command.substring(8);
            setCurrentPayload(payload);
            response = `💉 Payload set: ${payload}`;
          } else if (cmd.startsWith('attack ')) {
            const attackType = cmd.substring(7);
            executeAttack(attackType, currentPayload);
            return;
          } else {
            response = `❌ Unknown command: ${command}\nType 'help' for available commands.`;
          }
      }
      
      setTerminalOutput(prev => [...prev, response, '']);
    }, 500 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(currentCommand);
      setCurrentCommand('');
    }
  };

  const allObjectivesCompleted = objectives.every((obj: LabObjective) => obj.completed);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Back to Lab
            </button>
            <h1 className="text-xl font-bold">{labTitle} - Real-Time Environment</h1>
            <div className={`px-3 py-1 rounded-full text-sm flex items-center space-x-1 ${
              labStatus === 'running' ? 'bg-green-900 text-green-300' :
              labStatus === 'starting' ? 'bg-yellow-900 text-yellow-300' :
              'bg-gray-700 text-gray-300'
            }`}>
              <Zap className="h-4 w-4" />
              <span>{labStatus.toUpperCase()}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => initializeLab()}
              className="flex items-center space-x-1 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 rounded transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-screen">
        {/* Left Sidebar - Objectives & Tools */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 p-4 overflow-y-auto">
          {/* Objectives */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2 text-orange-500" />
              Lab Objectives
            </h2>
            <div className="space-y-3">
              {objectives.map((objective: LabObjective) => (
                <div key={objective.id} className={`p-3 rounded-lg border ${
                  objective.completed 
                    ? 'border-green-600 bg-green-900/20' 
                    : 'border-gray-600 bg-gray-700/50'
                }`}>
                  <div className="flex items-start space-x-2">
                    {objective.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                    ) : (
                      <div className="h-5 w-5 border-2 border-gray-500 rounded-full mt-0.5"></div>
                    )}
                    <span className={`text-sm ${objective.completed ? 'text-green-300' : 'text-gray-300'}`}>
                      {objective.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Attack Tools */}
          <div className="mb-6">
            <h3 className="text-md font-bold mb-3 flex items-center">
              <Shield className="h-4 w-4 mr-2 text-red-500" />
              Quick Attacks
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => executeAttack('sql-injection', "' OR 1=1--")}
                className="w-full text-left px-3 py-2 bg-red-700/30 hover:bg-red-600/30 rounded transition-colors text-sm border border-red-600/30"
              >
                💉 SQL Injection
              </button>
              <button
                onClick={() => executeAttack('idor', '/user/1337')}
                className="w-full text-left px-3 py-2 bg-orange-700/30 hover:bg-orange-600/30 rounded transition-colors text-sm border border-orange-600/30"
              >
                🔓 IDOR Attack
              </button>
              <button
                onClick={() => executeAttack('xss', '<script>alert(1)</script>')}
                className="w-full text-left px-3 py-2 bg-yellow-700/30 hover:bg-yellow-600/30 rounded transition-colors text-sm border border-yellow-600/30"
              >
                ⚡ XSS Injection
              </button>
              <button
                onClick={() => executeAttack('privilege-escalation', 'admin=true')}
                className="w-full text-left px-3 py-2 bg-purple-700/30 hover:bg-purple-600/30 rounded transition-colors text-sm border border-purple-600/30"
              >
                👑 Privilege Escalation
              </button>
            </div>
          </div>

          {/* Attack Results */}
          <div>
            <h3 className="text-md font-bold mb-3">Recent Attacks</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {attackResults.slice(0, 5).map((result: AttackResult) => (
                <div key={result.id} className={`p-2 rounded text-xs border ${
                  result.success 
                    ? 'border-green-600 bg-green-900/20 text-green-300' 
                    : 'border-red-600 bg-red-900/20 text-red-300'
                }`}>
                  <div className="flex items-center space-x-1 mb-1">
                    {result.success ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <AlertTriangle className="h-3 w-3" />
                    )}
                    <span className="font-medium">{result.attack}</span>
                  </div>
                  <div className="text-gray-400 truncate">{result.response}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Completion */}
          {allObjectivesCompleted && (
            <div className="mt-6 p-4 bg-green-900/30 border border-green-600 rounded-lg">
              <div className="flex items-center space-x-2 text-green-300 mb-2">
                <CheckCircle className="h-5 w-5" />
                <span className="font-bold">All Objectives Complete!</span>
              </div>
              <button
                onClick={onComplete}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition-colors"
              >
                Complete Lab
              </button>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Target Application */}
          <div className="h-1/2 border-b border-gray-700">
            <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ExternalLink className="h-4 w-4" />
                <span className="font-medium">Target: {selectedApp?.name || 'No target selected'}</span>
              </div>
              <div className="text-sm text-gray-400">{selectedApp?.url}</div>
            </div>
            <div className="h-full bg-white">
              {selectedApp && (
                <iframe
                  src={`data:text/html;charset=utf-8,${encodeURIComponent(`
                    <html>
                    <head>
                      <title>${selectedApp.name}</title>
                      <style>
                        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
                        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                        .login-form { border: 1px solid #ddd; padding: 20px; margin: 20px 0; border-radius: 5px; }
                        input { width: 100%; padding: 8px; margin: 5px 0; border: 1px solid #ccc; border-radius: 3px; }
                        button { background: #007cba; color: white; padding: 10px 20px; border: none; cursor: pointer; border-radius: 3px; }
                        .admin-link { color: #666; font-size: 12px; }
                        .vulnerable { background: #ffebee; border: 1px solid #f44336; padding: 10px; margin: 10px 0; border-radius: 3px; }
                        .success { background: #e8f5e8; border: 1px solid #4caf50; padding: 10px; margin: 10px 0; border-radius: 3px; }
                      </style>
                    </head>
                    <body>
                      <div class="container">
                        <h1>🎯 ${selectedApp.name}</h1>
                        <p>${selectedApp.description}</p>
                        
                        <div class="vulnerable">
                          <strong>⚠️ Known Vulnerabilities:</strong>
                          <ul>
                            ${selectedApp.vulnerabilities.map((v: string) => `<li>${v}</li>`).join('')}
                          </ul>
                        </div>
                        
                        <div class="login-form">
                          <h3>User Login</h3>
                          <form>
                            <input type="text" placeholder="Username" name="username" id="username">
                            <input type="password" placeholder="Password" name="password" id="password">
                            <button type="button" onclick="attemptLogin()">Login</button>
                          </form>
                        </div>
                        
                        <p>
                          <a href="#" class="admin-link" onclick="showAdmin()">Admin Panel</a> | 
                          <a href="#" onclick="showUsers()">User Profiles</a> |
                          <a href="#" onclick="showSearch()">Search</a>
                        </p>
                        
                        <div id="results"></div>
                        
                        <div style="margin-top: 30px; padding: 15px; background: #f0f0f0; border-radius: 5px;">
                          <h4>🔍 Attack Hints:</h4>
                          <ul>
                            <li>Try SQL injection in the login form: <code>' OR 1=1--</code></li>
                            <li>Look for IDOR in user profile URLs: <code>/user?id=1337</code></li>
                            <li>Test for XSS in search fields: <code>&lt;script&gt;alert(1)&lt;/script&gt;</code></li>
                            <li>Check for admin functionality bypasses</li>
                          </ul>
                        </div>
                      </div>
                      
                      <script>
                        function attemptLogin() {
                          const username = document.getElementById('username').value;
                          const password = document.getElementById('password').value;
                          const results = document.getElementById('results');
                          
                          if (username.includes("'") || username.includes("OR") || username.includes("--")) {
                            results.innerHTML = '<div class="success">🎉 SQL Injection successful! Admin access granted.</div>';
                          } else if (username === 'admin' && password === 'admin') {
                            results.innerHTML = '<div class="success">✅ Login successful! Welcome admin.</div>';
                          } else {
                            results.innerHTML = '<div class="vulnerable">❌ Login failed. Try SQL injection!</div>';
                          }
                        }
                        
                        function showAdmin() {
                          document.getElementById('results').innerHTML = '<div class="success">🔓 Admin panel accessed! You found an authorization bypass.</div>';
                        }
                        
                        function showUsers() {
                          document.getElementById('results').innerHTML = '<div class="success">👥 User list accessed! IDOR vulnerability confirmed.</div>';
                        }
                        
                        function showSearch() {
                          const searchTerm = prompt('Enter search term:');
                          if (searchTerm && searchTerm.includes('<script>')) {
                            document.getElementById('results').innerHTML = '<div class="success">⚡ XSS vulnerability confirmed! Script executed.</div>';
                          } else {
                            document.getElementById('results').innerHTML = '<div>Search results for: ' + (searchTerm || '') + '</div>';
                          }
                        }
                      </script>
                    </body>
                    </html>
                  `)}`}
                  className="w-full h-full border-0"
                  title="Vulnerable Application"
                />
              )}
            </div>
          </div>

          {/* Terminal */}
          <div className="h-1/2 flex flex-col">
            <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center space-x-2">
              <Terminal className="h-4 w-4" />
              <span className="font-medium">Attack Terminal</span>
            </div>
            <div 
              ref={terminalRef}
              className="flex-1 bg-black p-4 font-mono text-sm overflow-y-auto"
            >
              {terminalOutput.map((line, index) => (
                <div key={index} className="text-green-400 whitespace-pre-wrap">
                  {line}
                </div>
              ))}
              {isRunning && (
                <div className="flex items-center text-green-400">
                  <span className="mr-2">$</span>
                  <input
                    type="text"
                    value={currentCommand}
                    onChange={(e) => setCurrentCommand(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="bg-transparent border-none outline-none flex-1 text-green-400"
                    placeholder="Enter attack command..."
                    autoFocus
                  />
                  <span className="animate-pulse">|</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};