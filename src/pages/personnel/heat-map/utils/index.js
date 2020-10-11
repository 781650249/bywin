export const defineColor = (count) => {
  switch (true) {
    case count < 100:
      return { color: '#F157C2', intensity: '0.2' };
    case count >= 100 && count <= 300:
      return { color: '#9B78FF', intensity: '0.4' };
    case count >= 300 && count <= 500:
      return { color: '#29E9CA', intensity: '0.5' };
    case count >= 500 && count <= 700:
      return { color: '#27DA2B', intensity: '0.7' };
    case count >= 700 && count <= 1000:
      return { color: '#FAA84C', intensity: '0.9' };
    case count > 1000:
      return { color: '#F35555', intensity: '1.0' };
    default:
      break;
  }
};
