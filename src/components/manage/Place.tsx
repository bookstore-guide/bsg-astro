import { useEffect, useReducer } from 'react';
import DescriptionCounter from './DescriptionCounter';
import PlaceGeoLocation from './PlaceGeoLocation';
import TextInput from './TextInput';
import Traits from './Traits';
import { PLACEHOLDER_STORE } from '../../shared/consts';
import type { PlaceType, PlaceWithTraitsAndTypes, Trait } from '../../shared/types';
import PlaceTypes from './PlaceTypes';

type PlaceEditProps = { store: PlaceWithTraitsAndTypes; traits: Trait[]; placetypes: PlaceType[] };

const placeReducer = (
  place: PlaceWithTraitsAndTypes,
  updates: PlaceWithTraitsAndTypes
): PlaceWithTraitsAndTypes => {
  return { ...place, ...updates };
};

const Place: React.FunctionComponent<PlaceEditProps> = ({
  store,
  traits,
  placetypes
}: PlaceEditProps) => {
  const [place, setPlace] = useReducer(placeReducer, {
    ...PLACEHOLDER_STORE,
    id: store.id
  });

  const submitData = async () => {
    await fetch(`${import.meta.env.PUBLIC_API_URL}/api/admin/place/${place.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(place)
    });
    window.location.href = `${import.meta.env.PUBLIC_API_URL}/manage`;
  };

  const deletePlace = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    event.preventDefault();
    if (confirm('Are you sure you want to DELETE this place? This can not be undone.')) {
      await fetch(`${import.meta.env.PUBLIC_API_URL}/api/admin/place/${place.id}`, {
        method: 'DELETE'
      });
      window.location.href = `${import.meta.env.PUBLIC_API_URL}/manage`;
    }
  };

  const handleCheckBoxChange = (event: React.FormEvent<HTMLInputElement>): void => {
    setPlace({
      ...place,
      [event.currentTarget.name]: event.currentTarget.checked
    });
  };

  const handleInputChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    setPlace({
      ...place,
      [event.currentTarget.name]: event.currentTarget.value
    });
  };

  const handleGeoLocationChange = (lat: number, lng: number): void => {
    setPlace({
      ...place,
      lat,
      lng
    });
  };

  const handleTraitChange = (event: React.FormEvent<HTMLInputElement>): void => {
    const traitToAdd = traits.find((trait) => trait.id === Number(event.currentTarget.value));
    const addChangedTrait = traitToAdd ? place.traits.concat(traitToAdd) : [];

    const removeChangedTrait = place.traits.filter(
      (t) => t.id !== Number(event.currentTarget.value)
    );
    const changedTraits = event.currentTarget.checked ? addChangedTrait : removeChangedTrait;

    setPlace({
      ...place,
      traits: changedTraits
    });
  };

  const handleTypeChange = (event: React.FormEvent<HTMLInputElement>): void => {
    const typeToAdd = placetypes.find((type) => type.id === Number(event.currentTarget.value));
    const addChangedType = typeToAdd ? place.placetypes.concat(typeToAdd) : [];

    const removeChangedType = place.placetypes.filter(
      (t) => t.id !== Number(event.currentTarget.value)
    );
    const changedTypes = event.currentTarget.checked ? addChangedType : removeChangedType;

    setPlace({
      ...place,
      placetypes: changedTypes
    });
  };

  useEffect(() => {
    setPlace(store);
  }, [store]);

  const currentPage = place.id === 0 ? 'Add Place' : `Edit ${place.name}`;

  return (
    <>
      <div className="text-sm breadcrumbs">
        <ul>
          <li>
            <a href="../">Admin</a>
          </li>
          <li>{currentPage}</li>
        </ul>
      </div>
      <form className="max-w-xl" action={submitData}>
        <div className="border border-slate-500 max-w-xl float-right m-5 btn p-2">
          <label className="label cursor-pointer">
            <span className="label-text">Active ?</span>
            <input
              name="active"
              type="checkbox"
              checked={place.active}
              className="checkbox"
              onChange={handleCheckBoxChange}
            />
          </label>
        </div>
        <details
          className="clear-both  border-2 border-slate-500 p-0 collapse collapse-plus max-w-xl"
          open>
          <summary className="collapse-title  font-bold">Basic Info</summary>
          <div className="collapse-content">
            <TextInput
              labelText="Place Name"
              name="name"
              value={place.name}
              onChange={handleInputChange}
            />
            <TextInput
              labelText="Address"
              name="address1"
              value={place.address1}
              onChange={handleInputChange}
            />
            <TextInput
              labelText="Address 2"
              name="address2"
              value={place.address2}
              onChange={handleInputChange}
            />
            <TextInput
              labelText="Zipcode"
              name="zip5"
              value={place.zip5}
              onChange={handleInputChange}
            />
            <TextInput
              labelText="Phone"
              name="phone"
              value={place.phone}
              onChange={handleInputChange}
            />
            <label className="label">
              <span className="label-text">Description (main listing and meta tag)</span>
            </label>
            <textarea
              name="description"
              className="textarea textarea-bordered w-full mb-0"
              onChange={handleInputChange}
              value={place.description || ''}
            />
            <DescriptionCounter description={place.description} />

            <label className="label">
              <span className="label-text">Long Description (place page)</span>
            </label>
            <textarea
              name="longDescription"
              className="textarea textarea-bordered w-full mb-0"
              onChange={handleInputChange}
              value={place.longDescription || ''}
            />

            <TextInput labelText="URL" name="url" value={place.url} onChange={handleInputChange} />
            <label className="label">
              <span className="label-text">Internal Notes</span>
            </label>
            <textarea
              name="internalNotes"
              className="textarea textarea-bordered w-full mb-5"
              onChange={handleInputChange}
              value={place.internalNotes || ''}
            />
          </div>
        </details>
        <details className="clear-both  border-2 border-slate-500 p-0 mt-5 collapse collapse-plus max-w-xl">
          <summary className="collapse-title  font-bold">Geolocation</summary>
          <div className="collapse-content">
            <PlaceGeoLocation
              address={place.address1}
              lat={place.lat}
              lng={place.lng}
              zip={place.zip5}
              handleGeoLocationChange={handleGeoLocationChange}
              onChange={handleInputChange}
            />
          </div>
        </details>

        <details className="clear-both  border-2 border-slate-500 p-0 mt-5 collapse collapse-plus max-w-xl">
          <summary className="collapse-title  font-bold">Type</summary>
          <div className="collapse-content">
            <PlaceTypes
              placeTypes={place.placetypes}
              serverPlaceTypes={placetypes}
              onChangeHandler={handleTypeChange}
            />
          </div>
        </details>

        <details className="clear-both  border-2 border-slate-500 p-0 mt-5 collapse collapse-plus max-w-xl">
          <summary className="collapse-title  font-bold">Traits</summary>
          <div className="collapse-content">
            <Traits
              traits={place.traits}
              servertraits={traits}
              onChangeHandler={handleTraitChange}
            />
          </div>
        </details>

        <details className="clear-both  border-2 border-slate-500 p-0 mt-5 collapse collapse-plus max-w-xl">
          <summary className="collapse-title  font-bold">Hours</summary>
          <div className="collapse-content p-0 pl-2">
            <TextInput
              labelText="Hours Text"
              name="hoursText"
              value={place.hoursText}
              onChange={handleInputChange}
            />
          </div>
        </details>
        <div className="float-right">
          <button id="delete" className="btn btn-error m-5 inline" onClick={deletePlace}>
            Delete
          </button>
          <button type="submit" className="btn btn-warning ml-0 inline">
            Submit
          </button>
        </div>
      </form>
    </>
  );
};

export default Place;
