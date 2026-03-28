# Port Management Skill - Installation Guide

## For New Projects

This skill is part of the **AINative Core Skills Repository** located at:
```
/Users/aideveloper/core/.claude/skills/
```

All AINative projects should **symlink** to this core repository rather than copying files.

## Installation Steps

### 1. Symlink the Skill (Recommended)

From your project root:

```bash
# Remove local copy if it exists
rm -rf .claude/skills/port-management

# Create symlink to core
ln -s /Users/aideveloper/core/.claude/skills/port-management .claude/skills/port-management
```

### 2. Create Your Configuration

Copy the example and customize for your project:

```bash
# Copy example config
cp /Users/aideveloper/core/.claude/port-config.example.json .claude/port-config.json

# Edit for your services
nano .claude/port-config.json
```

### 3. Verify Symlink

```bash
# Check symlink is correct
ls -la .claude/skills/port-management

# Should show: port-management -> /Users/aideveloper/core/.claude/skills/port-management
```

## Why Symlink?

✅ **Single Source of Truth**: Updates to core propagate to all projects
✅ **Consistency**: All projects use same version
✅ **Easy Updates**: Update once, all projects benefit
✅ **Storage Efficient**: No duplicate files across projects

## Project Structure

```
your-project/
├── .claude/
│   ├── skills/
│   │   ├── port-management/       → symlink to core
│   │   └── [other-skills]/        → symlinks to core
│   └── port-config.json           ← project-specific (not symlinked)
└── scripts/
    └── start-all-local.sh         ← project-specific startup script
```

## Updating from Core

When core updates:

```bash
# Your symlinked projects automatically get updates
cd your-project
ls -la .claude/skills/port-management  # Shows latest from core
```

## Migration from Local Copy

If your project has a local copy instead of symlink:

```bash
# Backup your config if you have customizations
cp .claude/skills/port-management/SKILL.md /tmp/my-customizations.md

# Remove local copy
rm -rf .claude/skills/port-management

# Create symlink to core
ln -s /Users/aideveloper/core/.claude/skills/port-management .claude/skills/port-management

# Verify
ls -la .claude/skills/port-management
```

## Core Repository Structure

```
/Users/aideveloper/core/.claude/
├── skills/
│   ├── port-management/          ← Generic port management
│   ├── git-workflow/             ← Generic git rules
│   ├── file-placement/           ← Generic file placement
│   └── [other-generic-skills]/   ← Other reusable skills
├── port-config.example.json      ← Example configuration
└── [other-core-files]/
```

## Troubleshooting

### Symlink Broken

```bash
# Check if core exists
ls -la /Users/aideveloper/core/.claude/skills/port-management

# Recreate symlink
rm .claude/skills/port-management
ln -s /Users/aideveloper/core/.claude/skills/port-management .claude/skills/port-management
```

### Want to Customize

**DON'T modify the core skill!** Instead:

1. Create project-specific skill that extends core
2. Or contribute improvements back to core
3. Or use port-config.json for customization

### Permission Issues

```bash
# Ensure core directory is readable
chmod -R 755 /Users/aideveloper/core/.claude/skills/port-management
```

## Contributing Updates to Core

If you improve the skill:

1. Make changes in `/Users/aideveloper/core/.claude/skills/port-management/`
2. Test with multiple projects
3. Commit to core repository
4. All symlinked projects get the update automatically

## See Also

- `README.md` - Quick start guide
- `SKILL.md` - Complete documentation  
- `examples/` - Example configurations
- `/Users/aideveloper/core/.claude/port-config.example.json` - Reference config
