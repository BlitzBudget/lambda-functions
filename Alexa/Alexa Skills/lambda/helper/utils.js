const Utils = () => {};

function isEmpty(obj) {
  // Check if objext is a number or a boolean
  if (typeof obj === 'number' || typeof obj === 'boolean') return false;

  // Check if obj is null or undefined
  if (obj === null || obj === undefined) return true;

  // Check if the length of the obj is defined
  if (typeof obj.length !== 'undefined') return obj.length === 0;

  // check if obj is a custom obj
  if (obj && Object.keys(obj).length !== 0) { return false; }

  return true;
}

// Includes String
Utils.prototype.includesStr = (arr, val) => (isEmpty(arr) ? null : arr.includes(val));

// Is Empty Check
Utils.prototype.isEmpty = (obj) => isEmpty(obj);

Utils.prototype.isNotEmpty = (obj) => !isEmpty(obj);

Utils.prototype.isEqual = (obj1, obj2) => {
  if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
    return true;
  }
  return false;
};

Utils.prototype.getSlotValues = (filledSlots) => {
  const slotValues = {};

  Object.keys(filledSlots).forEach((item) => {
    const { name } = filledSlots[item];
    console.log(
      'The Slot Values calculated are',
      JSON.stringify(filledSlots[item]),
    );

    if (
      filledSlots[item]
      && filledSlots[item].resolutions
      && filledSlots[item].resolutions.resolutionsPerAuthority[0]
      && filledSlots[item].resolutions.resolutionsPerAuthority[0].status
      && filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code
    ) {
      let slotId = '';
      if (
        filledSlots[item].resolutions.resolutionsPerAuthority[0].values
        && filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value
          .id
      ) {
        slotId = filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0]
          .value.id;
      }

      switch (
        filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code
      ) {
        case 'ER_SUCCESS_MATCH':
          slotValues[name] = {
            heardAs: filledSlots[item].value,
            resolved:
              filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0]
                .value.name,
            id: slotId,
            ERstatus: 'ER_SUCCESS_MATCH',
          };
          break;
        case 'ER_SUCCESS_NO_MATCH':
          slotValues[name] = {
            heardAs: filledSlots[item].value,
            resolved: '',
            id: slotId,
            ERstatus: 'ER_SUCCESS_NO_MATCH',
          };
          break;
        default:
          break;
      }
    } else {
      slotValues[name] = {
        heardAs: filledSlots[item].value || '', // may be null
        resolved: '',
        ERstatus: '',
      };
    }
  }, this);

  return slotValues;
};

module.exports = new Utils();
