const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const getAddressCoordinate = require('../utils/location');

const dummyPlaces = [
  {
    id: '123',
    title: 'Istanbul',
    description: 'Hagia Sophia',
    address: 'Sultan Ahmet, Ayasofya Meydanı, 34122 Fatih/İstanbul, Turkey',
    imageUrl: 'http://i.hurimg.com/i/hdn/75/0x0/5c0d246dc03c0e15a49c546a.jpg',
    creatorId: 'user1',
    location: {
      lat: 41.008583,
      lng: 28.9779863
    }
  }
];

const getPlacesById = (req, res, next) => {
  const placeId = req.params.pid;
  const places = dummyPlaces.filter((element) => element.id === placeId);

  if (places.length === 0) {
    throw new HttpError('Could not find place.', 404);
  }
  res.json({ places });
};

const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const user = dummyUsers.find((element) => element.id === userId);
  res.json({ user });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid input submitted', 422));
  }

  const {
    title, description, address, creator
  } = req.body;

  let coordinates;

  try {
    coordinates = await getAddressCoordinate(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = {
    id: uuid(),
    title,
    description,
    address,
    creator,
    location: coordinates
  };
  dummyPlaces.push(createdPlace);
  res.status(201).json({ place: createdPlace });
};

const updatePlaceById = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid input submitted', 422);
  }

  const placeId = req.params.pid;
  const { title, description } = req.body;

  const updatedPlace = { ...dummyPlaces.find((element) => element.id === placeId) };
  const placeIndex = dummyPlaces.findIndex((element) => element.id === placeId);
  updatedPlace.title = title;
  updatedPlace.description = description;

  dummyPlaces[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};

const deletePlaceById = (req, res, next) => {
  const placeId = req.params.pid;

  if (!dummyPlaces.find((element) => element.id === placeId)) {
    throw new HttpError('Could not find place', 404);
  }

  dummyPlaces.dummyPlaces.filter((element) => element.id !== placeId);

  res.status(200).json({ message: 'Place deleted' });
};

exports.getPlacesById = getPlacesById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;
