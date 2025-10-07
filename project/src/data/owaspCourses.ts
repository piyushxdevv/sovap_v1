import { Course } from '../types';

export const owaspCourses: Course[] = [
  {
    id: 'owasp-course-1',
    title: 'OWASP Top 10 Web Application Security Risks',
    description: 'Master the most critical web application security risks as defined by OWASP',
    unlocked: false,
    progress: 0,
    modules: [
      {
        id: 'module-1',
        title: 'A01:2021 – Broken Access Control',
        description: 'Learn about access control failures and how to prevent them',
        content: `# Broken Access Control

## Overview
Access control enforces policy such that users cannot act outside of their intended permissions. Failures typically lead to unauthorized information disclosure, modification, or destruction of all data or performing a business function outside the user's limits.

## Common Weaknesses
- Violation of the principle of least privilege
- Bypassing access control checks by modifying the URL
- Elevation of privilege attacks
- Metadata manipulation
- CORS misconfiguration

## Prevention Strategies
1. Implement proper access control mechanisms
2. Use the principle of least privilege
3. Deny access by default
4. Implement proper session management
5. Rate limit API calls

## Real-world Examples
- Instagram bug allowing access to private accounts
- Facebook's privacy settings bypass
- Unauthorized admin panel access

## Lab Exercise
Practice identifying and exploiting broken access control vulnerabilities in a simulated environment.`,
        videoUrl: 'https://example.com/video1',
        labUrl: '/labs/broken-access-control',
        completed: false
      },
      {
        id: 'module-2',
        title: 'A02:2021 – Cryptographic Failures',
        description: 'Understanding cryptographic failures and secure implementation',
        content: `# Cryptographic Failures

## Overview
Previously known as Sensitive Data Exposure, this category focuses on failures related to cryptography which often leads to sensitive data exposure or system compromise.

## Common Issues
- Transmission of data in clear text
- Use of old or weak cryptographic algorithms
- Default crypto keys or weak keys
- Missing encryption validation
- Weak random number generation

## Prevention Methods
1. Classify data and apply controls accordingly
2. Encrypt all data in transit with secure protocols
3. Use strong encryption algorithms and keys
4. Implement proper key management
5. Disable caching for sensitive data

## Modern Cryptography Best Practices
- Use AES-256 for symmetric encryption
- Implement proper key rotation
- Use secure random number generators
- Apply proper certificate management

## Hands-on Lab
Implement secure encryption and identify weak cryptographic implementations.`,
        videoUrl: 'https://example.com/video2',
        labUrl: '/labs/cryptographic-failures',
        completed: false
      },
      {
        id: 'module-3',
        title: 'A03:2021 – Injection',
        description: 'Master injection vulnerabilities and prevention techniques',
        content: `# Injection Vulnerabilities

## Overview
Injection flaws occur when untrusted data is sent to an interpreter as part of a command or query. The attacker's hostile data can trick the interpreter into executing unintended commands.

## Types of Injection
- SQL Injection
- NoSQL Injection
- OS Command Injection
- LDAP Injection
- XPath Injection

## SQL Injection Deep Dive
SQL injection remains one of the most common and dangerous vulnerabilities:

### Union-based Injection
\`\`\`sql
' UNION SELECT username, password FROM users--
\`\`\`

### Boolean-based Blind Injection
\`\`\`sql
' AND 1=1--  (True condition)
' AND 1=2--  (False condition)
\`\`\`

## Prevention Strategies
1. Use parameterized queries (prepared statements)
2. Input validation and sanitization
3. Escape special characters
4. Use stored procedures carefully
5. Implement least privilege principle

## Code Examples
### Vulnerable Code:
\`\`\`javascript
const query = "SELECT * FROM users WHERE id = " + userId;
\`\`\`

### Secure Code:
\`\`\`javascript
const query = "SELECT * FROM users WHERE id = ?";
db.query(query, [userId]);
\`\`\``,
        videoUrl: 'https://example.com/video3',
        labUrl: '/labs/injection',
        completed: false
      },
      {
        id: 'module-4',
        title: 'A04:2021 – Insecure Design',
        description: 'Learn about secure design principles and threat modeling',
        content: `# Insecure Design

## Overview
Insecure design is a broad category representing different weaknesses, expressed as "missing or ineffective control design." It focuses on risks related to design and architectural flaws.

## Key Concepts
- Threat modeling
- Secure design patterns
- Security by design
- Defense in depth
- Fail securely

## Threat Modeling Process
1. Identify assets and threats
2. Analyze attack vectors
3. Determine risk levels
4. Design security controls
5. Validate security measures

## Secure Design Principles
- Economy of mechanism
- Fail-safe defaults
- Complete mediation
- Open design
- Separation of privilege
- Least common mechanism
- Psychological acceptability

## Common Design Flaws
- Missing rate limiting
- Inadequate security controls
- Business logic flaws
- Missing security headers
- Improper error handling

## Design Patterns for Security
- Authentication and authorization patterns
- Secure communication patterns
- Input validation patterns
- Logging and monitoring patterns`,
        videoUrl: 'https://example.com/video4',
        labUrl: '/labs/insecure-design',
        completed: false
      },
      {
        id: 'module-5',
        title: 'A05:2021 – Security Misconfiguration',
        description: 'Identify and fix common security misconfigurations',
        content: `# Security Misconfiguration

## Overview
Security misconfiguration is the most commonly seen issue, often resulting from insecure default configurations, incomplete configurations, open cloud storage, and verbose error messages.

## Common Misconfigurations
- Default accounts and passwords
- Unnecessary features enabled
- Missing security headers
- Outdated software
- Improper error handling
- Directory listing enabled

## Areas of Concern
1. Application servers
2. Database servers
3. Cloud services
4. Network devices
5. Operating systems

## Security Headers
Essential security headers to implement:
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security
- X-XSS-Protection

## Cloud Security Misconfigurations
- Open S3 buckets
- Overprivileged IAM roles
- Missing encryption
- Public databases
- Weak network controls

## Prevention Checklist
1. Implement security hardening guides
2. Regular security scanning
3. Automate configuration management
4. Remove unused features
5. Keep software updated`,
        videoUrl: 'https://example.com/video5',
        labUrl: '/labs/security-misconfiguration',
        completed: false
      },
      {
        id: 'module-6',
        title: 'A06:2021 – Vulnerable and Outdated Components',
        description: 'Manage component vulnerabilities and dependencies',
        content: `# Vulnerable and Outdated Components

## Overview
You are likely vulnerable if you do not know the versions of all components you use, including nested dependencies. This includes components you directly use and nested dependencies.

## Risk Factors
- Unknown component versions
- Vulnerable software
- Unsupported software
- Irregular patching
- Missing security testing

## Component Management
### Inventory Management
1. Create component inventory
2. Track versions and dependencies
3. Monitor for vulnerabilities
4. Plan update schedules
5. Test before deployment

### Tools for Management
- OWASP Dependency Check
- Snyk
- WhiteSource
- Sonatype Nexus
- GitHub Dependabot

## Vulnerability Databases
- National Vulnerability Database (NVD)
- CVE Details
- Security advisories
- Vendor notifications

## Best Practices
1. Remove unused dependencies
2. Obtain components from official sources
3. Use signed packages
4. Monitor for vulnerable components
5. Implement update policies

## Supply Chain Security
- Verify component integrity
- Use package managers with security features
- Implement software composition analysis
- Monitor third-party services`,
        videoUrl: 'https://example.com/video6',
        labUrl: '/labs/vulnerable-components',
        completed: false
      },
      {
        id: 'module-7',
        title: 'A07:2021 – Identification and Authentication Failures',
        description: 'Secure authentication and session management',
        content: `# Identification and Authentication Failures

## Overview
Confirmation of the user's identity, authentication, and session management is critical to protect against authentication-related attacks.

## Common Weaknesses
- Weak passwords
- Missing multi-factor authentication
- Session fixation
- Credential stuffing
- Brute force attacks

## Authentication Best Practices
### Password Security
1. Implement strong password policies
2. Use password strength meters
3. Prevent common passwords
4. Implement account lockout
5. Use secure password storage (bcrypt, scrypt, Argon2)

### Multi-Factor Authentication
- Something you know (password)
- Something you have (token, phone)
- Something you are (biometrics)

## Session Management
### Secure Session Handling
1. Generate secure session IDs
2. Implement proper session timeout
3. Secure session storage
4. Session invalidation on logout
5. Protect against session fixation

### JWT Security
- Use strong signing algorithms
- Implement proper token expiration
- Secure token storage
- Validate all claims
- Implement token blacklisting

## Common Attack Patterns
- Credential stuffing
- Password spraying
- Session hijacking
- Man-in-the-middle attacks
- Phishing attacks`,
        videoUrl: 'https://example.com/video7',
        labUrl: '/labs/authentication-failures',
        completed: false
      },
      {
        id: 'module-8',
        title: 'A08:2021 – Software and Data Integrity Failures',
        description: 'Ensure software and data integrity throughout the pipeline',
        content: `# Software and Data Integrity Failures

## Overview
Software and data integrity failures relate to code and infrastructure that does not protect against integrity violations. This includes insecure CI/CD pipelines and auto-update mechanisms.

## Key Areas
- CI/CD pipeline security
- Software supply chain
- Auto-update mechanisms
- Digital signatures
- Data integrity checks

## CI/CD Security
### Pipeline Protection
1. Secure source code management
2. Build environment security
3. Artifact signing and verification
4. Secure deployment processes
5. Infrastructure as code security

### Security Gates
- Static application security testing (SAST)
- Dynamic application security testing (DAST)
- Software composition analysis (SCA)
- Infrastructure scanning
- Security approval workflows

## Digital Signatures
### Implementation
- Code signing certificates
- Package signing
- Digital timestamping
- Certificate validation
- Revocation checking

## Data Integrity
### Protection Mechanisms
1. Cryptographic hashing
2. Digital signatures
3. Checksums and validation
4. Database integrity constraints
5. Backup verification

## Supply Chain Attacks
- Compromised dependencies
- Malicious packages
- Build system compromise
- Update mechanism attacks
- Third-party service compromise`,
        videoUrl: 'https://example.com/video8',
        labUrl: '/labs/integrity-failures',
        completed: false
      },
      {
        id: 'module-9',
        title: 'A09:2021 – Security Logging and Monitoring Failures',
        description: 'Implement effective security logging and monitoring',
        content: `# Security Logging and Monitoring Failures

## Overview
Logging and monitoring are critical for detecting, escalating, and responding to active breaches. Without proper logging and monitoring, breaches cannot be detected.

## Logging Best Practices
### What to Log
1. Authentication events
2. Authorization failures
3. Input validation failures
4. Application errors
5. High-value transactions

### Log Content
- Timestamp
- User identifier
- Source IP address
- Action performed
- Resource accessed
- Result (success/failure)

## Monitoring Strategies
### Real-time Monitoring
- Security incident detection
- Anomaly detection
- Threshold alerting
- Correlation analysis
- Automated response

### SIEM Implementation
1. Log collection and normalization
2. Event correlation
3. Threat intelligence integration
4. Incident response workflows
5. Forensic analysis

## Log Security
### Protection Measures
1. Log integrity protection
2. Secure log transmission
3. Access control for logs
4. Log retention policies
5. Secure log storage

## Incident Response
### Detection and Response
- Automated alerting
- Escalation procedures
- Forensic preservation
- Communication protocols
- Recovery procedures

## Compliance Requirements
- GDPR logging requirements
- PCI DSS logging standards
- SOX compliance
- HIPAA audit trails
- Industry-specific requirements`,
        videoUrl: 'https://example.com/video9',
        labUrl: '/labs/logging-monitoring',
        completed: false
      },
      {
        id: 'module-10',
        title: 'A10:2021 – Server-Side Request Forgery (SSRF)',
        description: 'Understand and prevent server-side request forgery attacks',
        content: `# Server-Side Request Forgery (SSRF)

## Overview
SSRF flaws occur whenever a web application is fetching a remote resource without validating the user-supplied URL. It allows an attacker to coerce the application to send requests to unexpected destinations.

## Attack Scenarios
### Internal Resource Access
- Access internal services
- Read internal files
- Bypass firewall restrictions
- Port scanning internal networks
- Access cloud metadata services

### Common Targets
- Cloud metadata services (AWS, Azure, GCP)
- Internal APIs and services
- Database connections
- File systems
- Network infrastructure

## Attack Techniques
### URL Manipulation
\`\`\`
# Accessing cloud metadata
http://169.254.169.254/latest/meta-data/

# Localhost bypass techniques
http://localhost:8080/admin
http://127.0.0.1:8080/admin
http://0.0.0.0:8080/admin
\`\`\`

### Protocol Exploitation
- file:// protocol for local files
- dict:// for banner grabbing
- gopher:// for complex payloads
- ldap:// for LDAP queries

## Prevention Strategies
### Input Validation
1. URL whitelist validation
2. Deny private IP ranges
3. URL schema restrictions
4. DNS resolution validation
5. Response validation

### Network Segmentation
- Isolate application servers
- Implement egress filtering
- Use dedicated service accounts
- Monitor outbound connections
- Implement network policies

## Code Examples
### Vulnerable Code:
\`\`\`python
import requests
url = request.form['url']
response = requests.get(url)
return response.content
\`\`\`

### Secure Code:
\`\`\`python
import requests
from urllib.parse import urlparse

def is_safe_url(url):
    parsed = urlparse(url)
    return parsed.hostname in ALLOWED_HOSTS

if is_safe_url(url):
    response = requests.get(url)
    return response.content
\`\`\``,
        videoUrl: 'https://example.com/video10',
        labUrl: '/labs/ssrf',
        completed: false
      }
    ]
  }
];