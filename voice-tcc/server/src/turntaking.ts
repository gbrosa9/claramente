export type TurnState = 'IDLE'|'LISTENING'|'THINKING'|'SPEAKING'

export class TurnManager {
  state: TurnState = 'IDLE'
  setState(s: TurnState) { this.state = s }
}
