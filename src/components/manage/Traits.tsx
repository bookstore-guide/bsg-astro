import type { Trait } from '../../shared/types';
import TraitCheckBox from './TraitCheckBox';

interface TraitsProps {
  traits: Trait[];
  servertraits: Trait[];
  onChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Traits: React.FunctionComponent<TraitsProps> = (props: TraitsProps) => {
  const traits = props.servertraits.map((trait: Trait) => {
    const match = props.traits.find((t) => {
      return t.id === trait.id;
    });

    const checked = match !== undefined;

    return (
      <TraitCheckBox
        id={trait.id}
        key={trait.id}
        name={trait.name}
        changeHandler={props.onChangeHandler}
        isChecked={checked}
      />
    );
  });

  return <>{traits}</>;
};

export default Traits;
