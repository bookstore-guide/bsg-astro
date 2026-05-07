import fetchJsonp from 'fetch-jsonp';

interface PlaceGeoLocationProps {
  address?: string | null;
  lat?: number | string | null;
  lng?: number | string | null;
  zip?: string | null;
  handleGeoLocationChange: (lat: number, lng: number) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PlaceGeoLocation: React.FunctionComponent<PlaceGeoLocationProps> = (
  props: PlaceGeoLocationProps
) => {
  const lat = props.lat || '';
  const lng = props.lng || '';

  const getGeoLocation = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    if (
      props.address !== undefined &&
      props.address !== null &&
      props.zip !== undefined &&
      props.zip !== null
    ) {
      const lookupAddress = `${props.address} San Francisco, CA ${props.zip}`;
      void fetchJsonp(
        `https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=${lookupAddress}&benchmark=Public_AR_Current&format=jsonp`
      )
        .then(async (res) => await res.json())
        .then((data) => {
          const { coordinates } = data.result.addressMatches[0];
          props.handleGeoLocationChange(coordinates.y, coordinates.x);
        });
    }
  };

  return (
    <div className="y">
      <div>
        <label className="label">
          <span className="label-text">Lattitude</span>
        </label>
        <input
          name="lat"
          type="text"
          className="input input-bordered input-primary w-full mb-5"
          value={lat}
          onChange={props.onChange}
        />
      </div>
      <div>
        <label className="label">
          <span className="label-text">Longitude</span>
        </label>
        <input
          name="lng"
          type="text"
          className="input input-bordered input-primary w-full mb-5"
          value={lng}
          onChange={props.onChange}
        />
      </div>
      <div>
        <button className="btn btn-info mt-9" onClick={getGeoLocation}>
          Get Geolocation From Address
        </button>
      </div>
    </div>
  );
};

export default PlaceGeoLocation;
