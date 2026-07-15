export class EstateAudio {
  private context?: AudioContext
  private master?: GainNode

  private createNoiseBuffer(context: AudioContext) {
    const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate)
    const data = buffer.getChannelData(0)
    for (let index = 0; index < data.length; index += 1)
      data[index] = Math.random() * 2 - 1
    return buffer
  }

  private playMechanicalClick() {
    if (!this.context || !this.master)
      return
    const oscillator = this.context.createOscillator()
    const gain = this.context.createGain()
    oscillator.type = 'triangle'
    oscillator.frequency.setValueAtTime(118, this.context.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(46, this.context.currentTime + 0.14)
    gain.gain.setValueAtTime(0.16, this.context.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.15)
    oscillator.connect(gain).connect(this.master)
    oscillator.start()
    oscillator.stop(this.context.currentTime + 0.16)
  }

  async enable() {
    if (this.master && this.context) {
      await this.context.resume()
      this.master.gain.exponentialRampToValueAtTime(0.2, this.context.currentTime + 0.5)
      this.playMechanicalClick()
      return
    }

    this.context = new AudioContext()
    this.master = this.context.createGain()
    this.master.gain.value = 0.0001
    this.master.connect(this.context.destination)

    const drone = this.context.createOscillator()
    const droneFilter = this.context.createBiquadFilter()
    const droneGain = this.context.createGain()
    drone.type = 'sine'
    drone.frequency.value = 43.65
    droneFilter.type = 'lowpass'
    droneFilter.frequency.value = 170
    droneGain.gain.value = 0.065
    drone.connect(droneFilter).connect(droneGain).connect(this.master)
    drone.start()

    const noise = this.context.createBufferSource()
    const noiseFilter = this.context.createBiquadFilter()
    const noiseGain = this.context.createGain()
    noise.buffer = this.createNoiseBuffer(this.context)
    noise.loop = true
    noiseFilter.type = 'lowpass'
    noiseFilter.frequency.value = 220
    noiseGain.gain.value = 0.02
    noise.connect(noiseFilter).connect(noiseGain).connect(this.master)
    noise.start()

    this.playMechanicalClick()
    this.master.gain.exponentialRampToValueAtTime(0.2, this.context.currentTime + 0.8)
  }

  disable() {
    if (this.context && this.master)
      this.master.gain.exponentialRampToValueAtTime(0.0001, this.context.currentTime + 0.35)
  }

  dispose() {
    return this.context?.close()
  }
}
