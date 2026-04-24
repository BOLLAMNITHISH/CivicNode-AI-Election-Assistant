import { isValidState, normaliseState, getEventsForState, getDeadlinesForState, getNextEvent } from './election-service';

describe('Election Service Validations', () => {
  it('correctly validates valid US states', () => {
    expect(isValidState('NY')).toBe(true);
    expect(isValidState('ca')).toBe(true);
    expect(isValidState('tx ')).toBe(true);
  });

  it('rejects invalid US states', () => {
    expect(isValidState('ZZ')).toBe(false);
    expect(isValidState('New York')).toBe(false);
  });

  it('normalises states correctly', () => {
    expect(normaliseState(' ny ')).toBe('NY');
    expect(normaliseState('Ca')).toBe('CA');
  });

  it('throws error when normalising invalid state', () => {
    expect(() => normaliseState('ZZ')).toThrow();
  });
});

describe('Election Service Retrievals', () => {
  it('merges national events globally', () => {
    const events = getEventsForState('NY');
    const nationalEvents = events.filter(e => e.state === 'NATIONAL');
    expect(nationalEvents.length).toBeGreaterThan(0);
  });

  it('filters upcoming only correctly', () => {
    const upcoming = getEventsForState('NY', { upcomingOnly: true });
    const now = new Date().getTime();
    upcoming.forEach(e => {
      expect(new Date(e.date).getTime()).toBeGreaterThan(now);
    });
  });

  it('returns deadlines specifically correctly', () => {
    const deadlines = getDeadlinesForState('CA');
    deadlines.forEach(e => {
      expect(e.eventType).toBe('deadline');
    });
  });

  it('fetches the next sequential event safely', () => {
    const nextEvent = getNextEvent('FL');
    if (nextEvent) {
      expect(new Date(nextEvent.date).getTime()).toBeGreaterThan(new Date().getTime());
    }
  });
});
