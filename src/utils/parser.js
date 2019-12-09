import DATAMAP from '../format';

const getType = (row) => row.charAt(0);
const canBeNested = (parent, type) => parent && DATAMAP[parent].nested.includes(type);
const canHaveNested = (type) => !!(DATAMAP[type].nested);
const splitLines = (data) => data.split('\n');

const getTagData = (row, type) => {
  const data = row.trim().split('|').slice(1);
  return data.reduce((res, val, i) => ({
    ...res,
    [DATAMAP[type].attrs[i]]: val,
  }), {});
};

export default (input) => {
  const data = splitLines(input);
  let index = 0;

  const findNested = (parent) => {
    let res = {};
    let hit = true;
    while (hit && index < data.length) {
      const type = getType(data[index]);

      // Check if type allowed to be nested in previous
      if (canBeNested(parent, type)) {
        index += 1;
        const { tag } = DATAMAP[type];

        // Grab tag data
        const obj = { [tag]: getTagData(data[index - 1], type) };

        // Check if type is allowed to have nested elements
        // and look for potential nested elements
        if (canHaveNested(type)) {
          obj[tag] = { ...obj[tag], ...findNested(type) };
        }

        // Check if tag already exist and convert to array if so
        // else insert data into res object
        if (res[tag]) {
          if (Array.isArray(res[tag])) {
            res[tag] = [...res[tag], obj[tag]];
          } else {
            res[tag] = [res[tag], obj[tag]];
          }
        } else {
          res = { ...res, ...obj };
        }
      } else {
        hit = false;
      }
    }
    return res;
  };

  const res = findNested('root');

  return Object.keys(res).length === 0 ? null : {
    [DATAMAP.root.tag]: res,
  };
};
