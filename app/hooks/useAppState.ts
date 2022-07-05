import { AppContext } from 'context';

import { useContext } from 'react';

export default function useAppState() {
  return useContext(AppContext);
}
