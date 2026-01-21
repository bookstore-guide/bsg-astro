import type { Place } from '../../../prisma/generated/prisma/client';
import SignOut from '../auth/SignOut';

const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/admin/places`);

const data: Place[] = await response.json();

const Places: React.FunctionComponent = () => {
  const placeAdminList = data.map((place: Place) => {
    const active = String(place.active);
    return (
      <tr key={place.id}>
        <td>{place.id}</td>
        <td>
          <a href={'../manage/place/' + place.id}>{place.name}</a>
        </td>
        <td>{place.address1}</td>
        <td>{place.zip5}</td>
        <td>{active}</td>
      </tr>
    );
  });

  const s = placeAdminList.length > 1 ? 's' : '';
  const countMessage = `${String(placeAdminList.length)} Place${s}`;
  return (
    <div>
      <div className="text-sm breadcrumbs">
        <ul>
          <li>Admin</li>
        </ul>
      </div>
      <a href="../manage/place/add">
        <button className="btn">Add a Place</button>
      </a>
      <SignOut />
      <div className="mt-4">{countMessage}</div>
      <div className="overflow-x-auto ">
        <table className="table table-zebra w-full mt-1">
          <thead>
            <tr className="border-none">
              <th>ID</th>
              <th>NAME</th>
              <th>ADDRESS</th>
              <th>ZIP</th>
              <th>ACTIVE</th>
            </tr>
          </thead>
          <tbody>{placeAdminList}</tbody>
        </table>
      </div>
    </div>
  );
};

export default Places;
