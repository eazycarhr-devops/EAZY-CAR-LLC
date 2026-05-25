import { Injectable } from '@nestjs/common';

@Injectable()
export class PublicApiService {
  async getLatestSignals() {
    // Mock data - should be connected to the signals signals signal database/service
    return [
      { pair: 'EURUSD', signal: 'BUY', price: 1.0850, time: new Date().toISOString(), status: 'ACTIVE' },
      { pair: 'GBPUSD', signal: 'SELL', price: 1.2610, time: new Date().toISOString(), status: 'ACTIVE' },
    ];
  }

  async getSignalByPair(pair: string) {
    const signals = await this.getLatestSignals();
    return signals.find(s => s.pair.toUpperCase() === pair.toUpperCase());
  }

  async getHighWinRateStrategies() {
    // Requirements: >= 85% WR
    return [
      { name: 'Harmonic Pattern A', winRate: '87%', description: 'High precision harmonic' },
      { name: 'Price Action Master', winRate: '91%', description: 'Trend following core' },
    ];
  }

  async getTopGainers() {
    return [
      { asset: 'BTC', gain: '5.2%', volatility: 'Medium' },
      { asset: 'ETH', gain: '3.1%', volatility: 'Low' },
    ];
  }

  async getLatestBlogPosts() {
    return [
      { title: 'Mastering Harmonics', author: 'MADFX-BOSS', date: '2026-05-20' },
      { title: 'API Guide v1', author: 'Dev Team', date: '2026-05-22' },
    ];
  }

  async registerWebhook(data: any) {
    // Logic to save webhook registration
    console.log('Registering webhook:', data);
    return { status: 'success', message: 'Webhook registered successfully' };
  }
}
