# Stanley's Desktop 1998™ Audio Files

This folder contains the 13 specific audio files used in Stanley's Desktop simulation.

## Audio File List

### System Sounds
- **`ambient.mp3`** - Background computer hum (loops continuously)
- **`boot.mp3`** - System startup chime
- **`reboot.mp3`** - System restart sound
- **`shutdown.mp3`** - Power-down sequence sound

### Hardware Sounds
- **`floppy.mp3`** - Floppy disk drive spinning/reading
- **`scan.mp3`** - Hard drive scanning operations
- **`typing.mp3`** - Mechanical keyboard typing

### Interface Sounds
- **`click.mp3`** - UI button/icon clicks
- **`open.mp3`** - Window opening sound
- **`close.mp3`** - Window closing sound

### Feedback Sounds
- **`success.mp3`** - Operation completion success
- **`error.mp3`** - System errors and crashes
- **`glitch.mp3`** - Digital glitches and static

## Audio Integration

### Operation Mapping
- **Boot Sequence**: `boot.mp3`, `floppy.mp3`, `scan.mp3`, `typing.mp3`, `success.mp3`, `error.mp3`, `glitch.mp3`
- **Desktop Operations**: `ambient.mp3` (continuous), `click.mp3`, `open.mp3`, `close.mp3`
- **System Actions**: `reboot.mp3`, `shutdown.mp3`
- **Applications**: `typing.mp3`, `scan.mp3`, `success.mp3`
- **Crashes/Glitches**: `error.mp3`, `glitch.mp3`

### Technical Specifications
- **Format**: MP3 (web-optimized)
- **Sample Rate**: 44.1kHz recommended
- **Bit Rate**: 192kbps recommended
- **Total Files**: 13 audio files
- **Deployment**: Optimized for Netlify CDN

## File Replacement
To customize audio:
1. Replace any file with your custom audio
2. Keep the exact same filename
3. Ensure web-compatible format (MP3, OGG, WAV)
4. Test audio timing with your custom files

---
*All audio files are synchronized with screen operations for optimal user experience.*
