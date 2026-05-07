import { useState, useEffect } from 'react';
import TextInput from './TextInput';

interface TaxonomyItem {
  id: number;
  name: string | null;
  description: string | null;
  internalNotes: string | null;
  active: boolean;
  exclude?: boolean;
}

interface TaxonomyEditProps {
  item: TaxonomyItem;
  apiBase: string;
  listPath: string;
  entityLabel: string;
  showExclude?: boolean;
}

const TaxonomyEdit: React.FunctionComponent<TaxonomyEditProps> = ({
  item,
  apiBase,
  listPath,
  entityLabel,
  showExclude = false
}: TaxonomyEditProps) => {
  const [state, setState] = useState<TaxonomyItem>(item);

  useEffect(() => {
    setState(item);
  }, [item]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setState({ ...state, [event.currentTarget.name]: event.currentTarget.value });
  };

  const handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setState({ ...state, [event.currentTarget.name]: event.currentTarget.checked });
  };

  const submitData = async () => {
    await fetch(`${import.meta.env.PUBLIC_API_URL}${apiBase}/${state.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state)
    });
    window.location.href = `${import.meta.env.PUBLIC_API_URL}${listPath}`;
  };

  const deleteItem = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    event.preventDefault();
    if (confirm(`Are you sure you want to DELETE this ${entityLabel}? This cannot be undone.`)) {
      await fetch(`${import.meta.env.PUBLIC_API_URL}${apiBase}/${state.id}`, {
        method: 'DELETE'
      });
      window.location.href = `${import.meta.env.PUBLIC_API_URL}${listPath}`;
    }
  };

  const isNew = state.id === 0;
  const pageTitle = isNew ? `Add ${entityLabel}` : `Edit ${state.name ?? entityLabel}`;

  return (
    <>
      <div className="text-sm breadcrumbs">
        <ul>
          <li><a href="/manage">Admin</a></li>
          <li><a href={listPath}>{entityLabel}s</a></li>
          <li>{pageTitle}</li>
        </ul>
      </div>
      <form className="max-w-xl" action={submitData}>
        <div className="border border-slate-500 max-w-xl float-right m-5 btn p-2">
          <label className="label cursor-pointer">
            <span className="label-text">Active?</span>
            <input
              name="active"
              type="checkbox"
              checked={state.active}
              className="checkbox"
              onChange={handleCheckbox}
            />
          </label>
        </div>
        {showExclude && (
          <div className="border border-slate-500 max-w-xl float-right m-5 btn p-2 mr-1">
            <label className="label cursor-pointer">
              <span className="label-text">Exclude?</span>
              <input
                name="exclude"
                type="checkbox"
                checked={state.exclude ?? false}
                className="checkbox"
                onChange={handleCheckbox}
              />
            </label>
          </div>
        )}
        <div className="clear-both border-2 border-slate-500 p-4 max-w-xl">
          <TextInput
            labelText="Name"
            name="name"
            value={state.name}
            onChange={handleChange}
          />
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            name="description"
            className="textarea textarea-bordered w-full mb-3"
            onChange={handleChange}
            value={state.description ?? ''}
          />
          <label className="label">
            <span className="label-text">Internal Notes</span>
          </label>
          <textarea
            name="internalNotes"
            className="textarea textarea-bordered w-full mb-3"
            onChange={handleChange}
            value={state.internalNotes ?? ''}
          />
        </div>
        <div className="float-right mt-4">
          {!isNew && (
            <button className="btn btn-error m-2" onClick={deleteItem}>
              Delete
            </button>
          )}
          <button type="submit" className="btn btn-warning m-2">
            Save
          </button>
        </div>
      </form>
    </>
  );
};

export default TaxonomyEdit;
