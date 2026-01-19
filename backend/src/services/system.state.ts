export enum SystemState {
  REGISTRATION_OPEN = 'REGISTRATION_OPEN',
  RAFFLE_STARTED = 'RAFFLE_STARTED', // No more registration
  RAFFLE_ENDED = 'RAFFLE_ENDED'
}

export class SystemStateService {
  private static currentState: SystemState = SystemState.REGISTRATION_OPEN;

  static getState(): SystemState {
    return this.currentState;
  }

  static setState(state: SystemState) {
    this.currentState = state;
  }

  static isRegistrationOpen(): boolean {
    return this.currentState === SystemState.REGISTRATION_OPEN;
  }
}
