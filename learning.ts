interface ClockInterface {
  width: number;
}

class Clock implements ClockInterface {
  constructor(h: number, m: number) {}

  width: number = 12;
}
