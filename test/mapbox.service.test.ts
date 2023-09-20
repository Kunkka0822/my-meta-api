import { expect } from "chai";
import { describe } from "mocha";
import MapboxGeoService from "../services/mapbox.geo.service";

// title: "main COntract-INfo",
const data = [
  {
    entryValue: 3.3 * 4,
    regionCode: "0xb794f5ea0ba39494ce839613fffba74279500140",
  },
  {
    entryValue: 3.5 * 4,
    regionCode: "0xb794f5ea0ba39494ce839613fffba74279500180",
  },
  {
    entryValue: 5.3 * 4,
    regionCode: "0xb794f5ea0ba39494ce839613fffba74279500190",
  },
  {
    entryValue: 5.5 * 8,
    regionCode: "0xb794f5ea0ba39494ce839613fffba74279500300",
  },

  {
    entryValue: 5.1 * 8,
    regionCode: "0xb794f5ea0ba39494ce839613fffba74279500999",
  },

  {
    entryValue: 7.4 * 4,
    regionCode: "0xb794f5ea0ba39494ce839613fffba74279500350",
  },

  {
    entryValue: 7.1 * 8,
    regionCode: "0xb794f5ea0ba39494ce839613fffba74279501300",
  },
];

describe("begin", function () {
  describe("Mapbox Service", function () {
    it("get address", async () => {
      const longlat = "-74.01268120200862,40.70072301956384";
      const { regionCode, place } = await MapboxGeoService.getAddress(longlat);
      expect(regionCode).to.be.not.empty;
      expect(place).to.be.not.empty;
    });
  });
});
