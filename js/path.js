path = {};

path.paramLengths = {
  M: 2,
  m: 2,
  L: 2,
  l: 2,
  H: 1,
  h: 1,
  V: 1,
  v: 1,
  C: 6,
  c: 6,
  S: 4,
  s: 4,
  Q: 4,
  q: 4,
  T: 2,
  t: 2,
  A: 7,
  a: 7
};


path.getBBox = pathString => path.getBBoxObj(path.parse(pathString));

path.getX = ({ type, values }) => {
  switch (type) {
    case "A":
    case "a":
      return [values[5] - values[0], values[5] + values[0]];
    case "H":
      return values;
    case "V":
      return [];
    case "L":
    case "l":
      return values.filter((_, i) => !(i % 2));
    case "C":
    case "c":
      return values.filter((_, i) => i % 6 === 4);
    case "Q":
    case "q":
      return values.filter((_, i) => i % 4 === 2);
    default:
      return values.filter((_, i) => !(i % 2));
  }
};

path.getY = ({ type, values }) => {
  switch (type) {
    case "A":
    case "a":
      return [values[6] - values[1], values[6] + values[1]];
    case "H":
      return [];
    case "V":
      return values;
    case "L":
    case "l":
      return values.filter((_, i) => i % 2);
    case "C":
    case "c":
      return values.filter((_, i) => i % 6 === 5);
    case "Q":
    case "q":
      return values.filter((_, i) => i % 4 === 3);
    default:
      return values.filter((_, i) => i % 2);
  }
};


path.getBBoxObj = pathObject => {
  if (pathObject.some(path.isRelative)) pathObject = toAbsoluteObj(pathObject);
  const x = [].concat(...pathObject.map(path.getX));
  const x0 = Math.min(...x);
  const x1 = Math.max(...x);
  const y = [].concat(...pathObject.map(path.getY));
  const y0 = Math.min(...y);
  const y1 = Math.max(...y);
  return {
    x: x0,
    y: y0,
    width: x1 - x0,
    height: y1 - y0
  };
};

path.isRelative = d => d.type === d.type.toLowerCase();


path.applyXY = (x, y, rx, ry) => ({ type, values }) => {
  switch (type) {
    case "A":
    case "a":
      return values.map((d, i) => {
        switch (i % path.paramLengths[type]) {
          case 0:
            return rx ? rx(d) : d;
          case 1:
            return ry ? ry(d) : d;
          case 5:
            return x(d);
          case 6:
            return y(d);
          default:
            return d;
        }
      });
    case "H":
    case "h":
      return values.map(x);
    case "V":
    case "v":
      return values.map(y);
    default:
      return values.map((d, i) => (i % 2 ? y(d) : x(d)));
  }
};

path.getEndPoint = (
  { type, values },
  [x = 0, y = 0],
  [x0 = 0, y0 = 0]
) => {
  switch (type) {
    case "A":
    case "C":
    case "L":
    case "M":
    case "Q":
    case "S":
    case "T":
      return values.slice(values.length - 2);
    case "H":
      return [values[values.length - 1], y];
    case "V":
      return [x, values[values.length - 1]];
    case "a":
    case "c":
    case "l":
    case "m":
    case "q":
    case "s":
    case "t":
      const [dx, dy] = values.slice(values.length - 2);
      return [x + dx, y + dy];
    case "h":
      return [x + values[values.length - 1], y];
    case "v":
      return [x, y + values[values.length - 1]];
    case "Z":
    case "z":
      return [x0, y0];
    default:
      return [x, y];
  }
};

path.isRelative = d => d.type === d.type.toLowerCase();

normalizeImplicitCommandsObj = pathObject =>
  [].concat(
    ...pathObject.map(({ type, values }) => {
      if (!values.length)
        return {
          type,
          values
        };
      const chunks = [];
      for (let i = 0; i < values.length; i += path.paramLengths[type]) {
        chunks.push(values.slice(i, i + path.paramLengths[type]));
      }
      return chunks.map((chunk, i) => {
        let newType = type === "M" ? "L" : type === "m" ? "l" : type;
        return {
          type: i ? newType : type,
          values: chunk
        };
      });
    })
  );

path.normalizeImplicitCommands = pathString =>
  path.stringify(path.normalizeImplicitCommandsObj(path.parse(pathString)));

path.toAbsoluteObj = function(pathObject, last = [0, 0], initial = [0, 0]) {
  if (!pathObject.length) return [];
  const [first, ...rest] = normalizeImplicitCommandsObj(pathObject);
  const newFirst = {
    type: first.type.toUpperCase(),
    values: path.isRelative(first)
      ? path.applyXY(
          x => x + last[0],
          y => y + last[1]
        )(first)
      : first.values
  };
  last = path.getEndPoint(newFirst, last, initial);
  if (newFirst.type === "M") initial = last;
  return [newFirst, ...path.toAbsoluteObj(rest, last, initial)];
}

path.translateObj = (x, y) => pathObject =>
  path.toAbsoluteObj(pathObject).map(({ type, values }) => ({
    type,
    values: path.applyXY(
      d => d + x,
      d => d + y
    )({
      type,
      values
    })
  }));

path.replaceRecursive = function(str, regex, newThing) {
  return regex.test(str)
    ? path.replaceRecursive(str.replace(regex, newThing), regex, newThing)
    : str;
}

path.stringify = pathObject =>
  pathObject.map(d => d.type + d.values.join(" ")).join("");

path.parse = d =>
  d
    .trim()
    .split(/(?=[MmLlHhVvCcSsAaQqTtZz])/)
    .map(d => ({
      type: d.charAt(0),
      values: path.replaceRecursive(d.substr(1), /([0-9]*\.[0-9]*)\./, "$1 .")
        .replace(/([0-9.])-/g, "$1 -")
        .split(/[\n\s,]/)
        .filter(d => d.length)
        .map(d => +d)
    }));

path.translate = (x, y) => pathString =>
  path.stringify(path.translateObj(x, y)(path.parse(pathString)));


