class DataStore {
  constructor() {
    this.load();
  }
  save() {
    localStorage.setItem("gameData", JSON.stringify(this.data));
  }
  load() {
    this.data = JSON.parse(localStorage.getItem("gameData")) || {
      gridSizeX: 3,
      gridSizeY: 3,
      theme: "1",
      nickname: "",
      returning: false,
      lastGames: {},
    };
    return this.data;
  }
}
