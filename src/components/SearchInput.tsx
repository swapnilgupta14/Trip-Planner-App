import React from 'react';
import { usePackingContext } from '../context/AppContext';

interface SearchInputProps {
  isPacked: boolean;
}

export default function SearchInput({ isPacked }: SearchInputProps) {
  const { state, dispatch } = usePackingContext();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const action = isPacked ? 'SET_PACKED_SEARCH_QUERY' : 'SET_UNPACKED_SEARCH_QUERY';
    dispatch({ type: action, payload: e.target.value });
  };

  const value = isPacked ? state.packedSearchQuery : state.unpackedSearchQuery;

  return (
    <input
      type="text"
      placeholder="Search items..."
      value={value}
      onChange={handleSearch}
      className="px-3 py-1 border rounded focus:border-black"
    />
  );
}