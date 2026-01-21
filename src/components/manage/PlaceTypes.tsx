import type { PlaceType } from '../../shared/types';
import TraitCheckBox from './TraitCheckBox';

interface PlaceTypeProps {
  placeTypes: PlaceType[];
  serverPlaceTypes: PlaceType[];
  onChangeHandler: (event: React.FormEvent<HTMLInputElement>) => void;
}

const PlaceTypes: React.FunctionComponent<PlaceTypeProps> = (props: PlaceTypeProps) => {
  const placeTypes = props.serverPlaceTypes.map((placeType: PlaceType) => {
    const match = props.placeTypes.find((pt) => {
      return pt.id === placeType.id;
    });

    const checked = match !== undefined;

    return (
      <TraitCheckBox
        id={placeType.id}
        key={placeType.id}
        name={placeType.name}
        changeHandler={props.onChangeHandler}
        isChecked={checked}
      />
    );
  });

  return <>{placeTypes}</>;
};

export default PlaceTypes;
