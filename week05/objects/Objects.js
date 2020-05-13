const set = new Set();
const globalProperties = [
  "eval",
  "isFinite",
  "isNaN",
  "parseFloat",
  "parseInt",
  "decodeURI",
  "decodeURIComponent",
  "encodeURI",
  "encodeURIComponent",
  "Array",
  "Date",
  "RegExp",
  "Promise",
  "Proxy",
  "Map",
  "WeakMap",
  "Set",
  "WeakSet",
  "Function",
  "Boolean",
  "String",
  "Number",
  "Symbol",
  "Object",
  "Error",
  "EvalError",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "TypeError",
  "URIError",
  "ArrayBuffer",
  "SharedArrayBuffer",
  "DataView",
  "Float32Array",
  "Float64Array",
  "Int8Array",
  "Int16Array",
  "Int32Array",
  "Uint8Array",
  "Uint16Array",
  "Uint32Array",
  "Uint8ClampedArray",
  "Atomics",
  "JSON",
  "Math",
  "Reflect",
];

const ROOT_KEY = "Object";

let current;
const queue = [];
const result = { id: ROOT_KEY, label: ROOT_KEY, children: [] };

for (let p of globalProperties) {
  queue.push({
    path: [p],
    object: this[p],
  });
}

while (queue.length) {
  current = queue.shift();
  if (current.path.length > 10) {
    debugger;
  }
  if (set.has(current.object)) {
    continue;
  }

  set.add(current.object);
  // result.push(current)
  // 构造 antv 的树结构
  let tempVal = result; // 记录中间变量节点
  for (let i = 0; i < current.path.length; i++) {
    if (i < current.path.length - 1) {
      tempVal = tempVal.children.find(({ label }) => label === current.path[i]);
    } else {
      const val = {
        id: [ROOT_KEY].concat(current.path).join("."),
        label: current.path[i],
        children: [],
        collapsed: i < 2
      };
      tempVal.children.push(val);
    }
  }

  for (let p of Object.getOwnPropertyNames(current.object)) {
    const property = Object.getOwnPropertyDescriptor(current.object, p);

    if (
      property.hasOwnProperty("value") &&
      ((property.value !== null && typeof property.value === "object") ||
        typeof property.value === "function") &&
      property.value instanceof Object
    ) {
      queue.push({
        path: current.path.concat([p]),
        object: property.value,
      });
    }
    if (property.hasOwnProperty("get") && typeof property.get === "function") {
      queue.push({
        path: current.path.concat([property.name]),
        object: property.get,
      });
    }

    if (property.hasOwnProperty("set") && typeof property.set === "function") {
      queue.push({
        path: current.path.concat([p]),
        object: property.set,
      });
    }
  }
}
console.log(result);

window.result = result;
