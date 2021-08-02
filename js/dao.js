const dao = [
  {
    name: "collectionIndex",
    label: "Collection Index",
    type: "number",
    default: 0,
    private: true,
    save: true
  },

  {
    name: "stageIndex",
    label: "Stage Index",
    type: "number",
    default: 0,
    private: true,
    save: true
  },

  {
    name: "stageScore",
    label: "Stage Score",
    type: "array",
    default: "0,0,0,0,0,0,0,0,0,0",
    private: true,
    save: true
  },

  {
    name: "stageComparing",
    label: "Stage Comparing",
    type: "boolean",
    default: false,
    private: true,
    save: true
  },
  {
    name: "darkmode",
    label: "Dark Mode",
    type: "boolean",
    default: true,
    private: true,
    save: true
  },
  {
    name: "visited",
    label: "Visited",
    type: "boolean",
    default: true,
    private: true,
    save: true
  },
];

dao.forEach(thing => {
  thing.clean = function(value){
     if (thing.type === "number") return isNaN(value) ? 0 : parseInt(value, 10);
     if (thing.type === "string") return value  || "";
     if (thing.type === "boolean") return value === true || value === "true" ? true : false;
     if (thing.type === "url") return value || "";
     if (thing.type === "id") return value || 0;
     if (thing.type === "array") return typeof value === "object" ? value : typeof value === "string" ? value.split(",") : [];
     else throw "type " + thing.type + " does not exist";
  }
});
