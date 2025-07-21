/** @fileoverview Tests visited territory data store. */

import { describe, beforeEach, it, expect } from 'vitest';
import { visitedTerritories, TEST_ONLY } from '../visited_territory_data';

describe('visitedTerritories', () => {
  beforeEach(() => {
    localStorage.clear();
    for (const key in visitedTerritories) {
      delete visitedTerritories[key];
    }
  });

  it('should start empty', () => {
    expect(visitedTerritories.visitedCount).to.eq(0);
    expect(visitedTerritories.visitedPercentage).to.eq(0);
  });

  it('calculates visited count correctly', () => {
    visitedTerritories['1'] = true;
    visitedTerritories['2'] = true;
    visitedTerritories['3'] = true;
    visitedTerritories['4'] = true;
    visitedTerritories['5'] = true;
    visitedTerritories['6'] = true;
    visitedTerritories['7'] = true;
    visitedTerritories['8'] = true;
    visitedTerritories['9'] = true;
    visitedTerritories['10'] = true;
    visitedTerritories['11'] = true;
    visitedTerritories['12'] = true;
    visitedTerritories['13'] = true;
    visitedTerritories['14'] = true;
    visitedTerritories['15'] = true;
    visitedTerritories['16'] = true;
    visitedTerritories['17'] = true;
    visitedTerritories['18'] = true;
    visitedTerritories['19'] = true;

    expect(visitedTerritories.visitedCount).to.eq(19);
  });

  it('calculates visited percentage correctly', () => {
    visitedTerritories['1'] = true;
    visitedTerritories['2'] = true;
    visitedTerritories['3'] = true;
    visitedTerritories['4'] = true;
    visitedTerritories['5'] = true;
    visitedTerritories['6'] = true;
    visitedTerritories['7'] = true;
    visitedTerritories['8'] = true;
    visitedTerritories['9'] = true;
    visitedTerritories['10'] = true;
    visitedTerritories['11'] = true;
    visitedTerritories['12'] = true;
    visitedTerritories['13'] = true;
    visitedTerritories['14'] = true;
    visitedTerritories['15'] = true;
    visitedTerritories['16'] = true;
    visitedTerritories['17'] = true;
    visitedTerritories['18'] = true;
    visitedTerritories['19'] = true;

    // Currently, there are 193 territories. We are adding 19: ~10%.
    expect(visitedTerritories.visitedPercentage).to.eq(10);
  });

  describe('adding territories', () => {
    it('should count added territories', () => {
      visitedTerritories['AA'] = { visited: true };

      expect(visitedTerritories.visitedCount).to.eq(1);
    });

    it('should increase territory percentage', () => {
      const initialPercentage = visitedTerritories.visitedPercentage;
      visitedTerritories['AA'] = true;

      expect(visitedTerritories.visitedPercentage).to.greaterThan(
        initialPercentage
      );
      expect(visitedTerritories.visitedPercentage).to.be.a('number');
      expect(visitedTerritories.visitedPercentage).to.be.within(0, 100);
    });
  });

  describe('updating territories', () => {
    it('should update visited status', () => {
      visitedTerritories['AA'] = true;
      expect(visitedTerritories.visitedCount).to.eq(1);
      visitedTerritories['AA'] = false;
      expect(visitedTerritories.visitedCount).to.eq(0);
      visitedTerritories['AA'] = true;
      expect(visitedTerritories.visitedCount).to.eq(1);
      visitedTerritories['BB'] = true;
      expect(visitedTerritories.visitedCount).to.eq(2);
    });

    it('should remove not visited territories', () => {
      visitedTerritories['AA'] = true;
      expect(visitedTerritories.visitedCount).to.eq(1);

      visitedTerritories['AA'] = false;

      expect(visitedTerritories.visitedCount).to.eq(0);
    });

    it('should reduce percentage for not visited territories', () => {
      visitedTerritories['AA'] = true;
      const initialPercentage = visitedTerritories.visitedPercentage;

      visitedTerritories['AA'] = false;

      expect(visitedTerritories.visitedPercentage).to.lessThan(
        initialPercentage
      );
      expect(visitedTerritories.visitedPercentage).to.be.a('number');
      expect(visitedTerritories.visitedPercentage).to.be.within(0, 100);
    });
  });

  describe('removing territories', () => {
    it('should not count removed territories', () => {
      visitedTerritories['AA'] = true;
      expect(visitedTerritories.visitedCount).to.eq(1);

      delete visitedTerritories['AA'];

      expect(visitedTerritories.visitedCount).to.eq(0);
    });

    it('should reduce percentage for removed territories', () => {
      visitedTerritories['AA'] = true;
      const initialPercentage = visitedTerritories.visitedPercentage;

      delete visitedTerritories['AA'];
      expect(visitedTerritories.visitedPercentage).to.lessThan(
        initialPercentage
      );
      expect(visitedTerritories.visitedPercentage).to.be.a('number');
      expect(visitedTerritories.visitedPercentage).to.be.within(0, 100);
    });
  });

});
