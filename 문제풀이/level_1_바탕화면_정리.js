// 프로그래머스 level 1 - 바탕화면 정리 161990

'use strict';

class Computer {
  static RESOURCE_FORMAT = {
    FILE: '#',
    EMPTY: '.',
  };

  #resources;

  save(resources) {
    this.#resources = resources.map((resourceBundle) => resourceBundle.split(''));
  }

  loadResources() {
    return this.#resources;
  }

  getResourceFormats() {
    return Object.keys(Computer.RESOURCE_FORMAT).map((name) => Computer.RESOURCE_FORMAT[name]);
  }

  searchResourceCount(targetFormat) {
    let totalCount = 0;

    this.loadResources().forEach((resource) => {
      totalCount += resource.filter((format) => format === targetFormat).length;
    });

    return totalCount;
  }
}

class Wallpaper {
  #width;
  #height;
  #computer;

  constructor(computer) {
    this.#computer = computer;
  }

  get width() {
    return this.#width;
  }

  get height() {
    return this.#height;
  }

  setViewport(width, height) {
    this.#width = width;
    this.#height = height;
  }

  getResource(pointY, poinX) {
    return this.#computer.loadResources()[pointY][poinX];
  }

  getResourceFormats() {
    return this.#computer.getResourceFormats();
  }

  getResourceCount(format) {
    return this.#computer.searchResourceCount(format);
  }
}

class MousePointer {
  static #DEFAULT_SELECTED_RESOURCE = {
    count: 0,
  };

  #display;
  #movableRange;
  #position;
  #selectedResources;

  constructor(display) {
    this.#display = display;
    this.#movableRange = { vertical: display.height, horizontal: display.width };

    this.#position = { y: 0, x: 0 };

    this.#initializeSelectedResources();
  }

  #getDefaultSelectedResources() {
    let defaultSelectedResource = {};

    this.#display.getResourceFormats().forEach((format) => {
      defaultSelectedResource[format] = { ...MousePointer.#DEFAULT_SELECTED_RESOURCE };
    });

    return defaultSelectedResource;
  }

  #initializeSelectedResources() {
    this.#selectedResources = this.#getDefaultSelectedResources();
  }

  move(pointY, pointX) {
    this.#position.y = pointY;
    this.#position.x = pointX;
  }

  drag(callback) {
    const startPointY = this.#position.y;
    const startPointX = this.#position.x;
    let lastPointY = startPointY;
    let lastPointX = startPointX;

    let memoizationSelectedResources = Array.from({ length: this.#movableRange.horizontal }, () =>
      this.#getDefaultSelectedResources()
    );

    while (lastPointY < this.#movableRange.vertical) {
      while (lastPointX < this.#movableRange.horizontal) {
        const currentPointResourceFormat = this.#display.getResource(lastPointY, lastPointX);

        this.#selectedResources[currentPointResourceFormat].count += 1;

        this.#display.getResourceFormats().forEach((format) => {
          memoizationSelectedResources[lastPointX][format].count +=
            this.#selectedResources[format].count;
        });

        callback({
          draggingPoint: { startPointY, startPointX, lastPointY, lastPointX },
          selectedResources: memoizationSelectedResources[lastPointX],
        });

        lastPointX += 1;
      }

      this.#initializeSelectedResources();

      lastPointX = startPointX;
      lastPointY += 1;
    }
  }
}

function solution(resources) {
  const computer = new Computer();
  computer.save(resources);

  const wallpaper = new Wallpaper(computer);
  wallpaper.setViewport(resources[0].length, resources.length);

  const mousePointer = new MousePointer(wallpaper);

  const viewportFileCount = wallpaper.getResourceCount(Computer.RESOURCE_FORMAT.FILE);
  let minimumDistance = Infinity;
  let minimumDistanceDraggingPosition;

  const compareMinimumDistance = ({ draggingPoint, selectedResources }) => {
    const { startPointY, startPointX, lastPointY, lastPointX } = draggingPoint;
    const draggingDistance = lastPointY - startPointY + (lastPointX - startPointX);
    const selectedFileCount = selectedResources[Computer.RESOURCE_FORMAT.FILE].count;

    if (selectedFileCount === viewportFileCount && draggingDistance < minimumDistance) {
      minimumDistance = draggingDistance;
      minimumDistanceDraggingPosition = [startPointY, startPointX, lastPointY + 1, lastPointX + 1];
    }
  };

  for (let pointY = 0; pointY < wallpaper.height; pointY++) {
    for (let pointX = 0; pointX < wallpaper.width; pointX++) {
      mousePointer.move(pointY, pointX);
      mousePointer.drag(compareMinimumDistance);
    }
  }

  return minimumDistanceDraggingPosition;
}
