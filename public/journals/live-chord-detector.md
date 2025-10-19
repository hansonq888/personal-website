# Live Chord Detector v1.0

A machine learning system that identifies musical chords from live audio in real-time. It supports 24 chord types (12 major, 12 minor) and works across different instruments and playing styles.

# How It Started
I wanted to build something that could identify chords from live audio input. The main challenge was making it work across different instruments while keeping the latency low enough for real-time use. This combines my interest in machine learning with music.

# How It Works
The system has three main parts:

**Data Generation**: I created 22,680 audio samples by generating 24 base MIDI chords and applying variations like pitch shifts, velocity changes, octave shifts, and inversions.

**Model Training**: Used a Random Forest classifier with 300 trees. The model learns from 100 different audio features including chroma features, MFCCs, spectral statistics, and tempo analysis.

**Live Detection**: The microphone captures audio, extracts features, and predicts the chord in real-time.

# Performance
- Accuracy: 90-95% across different instruments
- Latency: Under 100ms
- Memory usage: Around 50MB

# Technical Details
The system uses Python with scikit-learn for the machine learning model and librosa for audio processing. I implemented a multi-threaded architecture with separate threads for audio capture, processing, and display to keep everything running smoothly.

The feature extraction includes chroma features for harmonic analysis, MFCCs for timbral characteristics, and various spectral statistics. The Random Forest model handles the noisy nature of live audio data well and provides fast predictions.

# Challenges
The biggest challenges were maintaining low latency while processing complex audio features, and selecting the right features that would work across different instruments and playing styles. Threading coordination was also tricky to get right.

# What's Next
I'd like to add support for 7th chords, diminished, and augmented chords. Eventually I want to detect chord progressions and musical keys, and maybe develop mobile or cloud versions.

# Reflection
This project taught me a lot about real-time audio processing and machine learning. It was satisfying to build something that actually works with live music and could be useful for musicians or music applications.
