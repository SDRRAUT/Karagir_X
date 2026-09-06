import { locationService } from '@/api/locationService';

describe('LocationService', () => {
  beforeEach(() => {
    locationService.clearCache();
  });

  it('fetches countries list with India as primary country', async () => {
    const countries = await locationService.getCountries();
    expect(countries.length).toBeGreaterThan(0);
    const india = countries.find((c) => c.isoCode === 'IN');
    expect(india).toBeDefined();
    expect(india?.name).toBe('India');
  });

  it('fetches 36 States and UTs for India with official LGD codes', async () => {
    const states = await locationService.getStates(1);
    expect(states.length).toBeGreaterThanOrEqual(36);
    const maharashtra = states.find((s) => s.name === 'Maharashtra');
    expect(maharashtra).toBeDefined();
    expect(maharashtra?.lgdCode).toBe(27);
    expect(maharashtra?.nameHi).toBe('महाराष्ट्र');
    expect(maharashtra?.nameMr).toBe('महाराष्ट्र');

    const up = states.find((s) => s.name === 'Uttar Pradesh');
    expect(up).toBeDefined();
    expect(up?.lgdCode).toBe(9);
  });

  it('fetches districts for Maharashtra with LGD codes', async () => {
    const states = await locationService.getStates(1);
    const maharashtra = states.find((s) => s.name === 'Maharashtra');
    expect(maharashtra).toBeDefined();

    const districts = await locationService.getDistricts(maharashtra!.id);
    expect(districts.length).toBeGreaterThan(0);
    const kolhapur = districts.find((d) => d.name === 'Kolhapur');
    expect(kolhapur).toBeDefined();
    expect(kolhapur?.lgdCode).toBe(484);
  });

  it('fetches sub-districts / talukas for Kolhapur district', async () => {
    const states = await locationService.getStates(1);
    const maharashtra = states.find((s) => s.name === 'Maharashtra')!;
    const districts = await locationService.getDistricts(maharashtra.id);
    const kolhapur = districts.find((d) => d.name === 'Kolhapur')!;

    const subDistricts = await locationService.getSubDistricts(kolhapur.id);
    expect(subDistricts.length).toBeGreaterThan(0);
    const karveer = subDistricts.find((sd) => sd.name === 'Karveer');
    expect(karveer).toBeDefined();
    expect(karveer?.lgdCode).toBe(4165);
    expect(karveer?.subDistrictType).toBe('TALUKA');
  });

  it('searches villages & craft clusters in a sub-district', async () => {
    const states = await locationService.getStates(1);
    const maharashtra = states.find((s) => s.name === 'Maharashtra')!;
    const districts = await locationService.getDistricts(maharashtra.id);
    const kolhapur = districts.find((d) => d.name === 'Kolhapur')!;
    const subDistricts = await locationService.getSubDistricts(kolhapur.id);
    const hatkanangle = subDistricts.find((sd) => sd.name === 'Hatkanangle')!;

    const villages = await locationService.searchVillages(hatkanangle.id, 'Hupari');
    expect(villages.length).toBeGreaterThan(0);
    const hupari = villages[0];
    expect(hupari.name).toContain('Hupari');
    expect(hupari.isCraftCluster).toBe(true);
    expect(hupari.craftSpecialty).toContain('Silver');
  });

  it('correctly localizes location names based on language preference', () => {
    const item = {
      name: 'Maharashtra',
      nameHi: 'महाराष्ट्र',
      nameMr: 'महाराष्ट्र राज्य',
    };

    expect(locationService.getLocalizedName(item, 'en_IN')).toBe('Maharashtra');
    expect(locationService.getLocalizedName(item, 'hi_IN')).toBe('महाराष्ट्र');
    expect(locationService.getLocalizedName(item, 'mr_IN')).toBe('महाराष्ट्र राज्य');
  });

  it('parses spoken voice query into matching location hierarchy', async () => {
    const speechText = 'Mera karkhana Hatkanangle Kolhapur Maharashtra mein hai';
    const match = await locationService.parseVoiceLocation(speechText);

    expect(match).not.toBeNull();
    expect(match?.stateName).toBe('Maharashtra');
    expect(match?.districtName).toBe('Kolhapur');
    expect(match?.subDistrictName).toBe('Hatkanangle');
  });
});
