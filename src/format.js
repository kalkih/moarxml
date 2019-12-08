export default {
  root: {
    tag: 'people',
    nested: [
      'P',
    ],
  },
  P: {
    tag: 'person',
    attrs: [
      'firstname',
      'lastname',
    ],
    nested: [
      'T',
      'A',
      'F',
    ],
  },
  F: {
    tag: 'family',
    attrs: [
      'name',
      'born',
    ],
    nested: [
      'T',
      'A',
    ],
  },
  T: {
    tag: 'phone',
    attrs: [
      'mobile',
      'home',
    ],
  },
  A: {
    tag: 'address',
    attrs: [
      'street',
      'city',
      'code',
    ],
  },
};
