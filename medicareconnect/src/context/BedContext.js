import React, { createContext, useContext, useMemo, useReducer, useCallback } from 'react';

const BedContext = createContext(null);

const createBeds = (ward, total, occupied, prefix) =>
  Array.from({ length: total }, (_, index) => ({
    id: index + 1,
    bedId: `${prefix}-${index + 1}`,
    ward,
    occupied: index < occupied,
    patientId: index < occupied ? `p00${(index % 6) + 1}` : null,
  }));

const initialState = {
  icu: { total: 8, beds: createBeds('ICU', 8, 5, 'ICU') },
  general: { total: 25, beds: createBeds('General', 25, 18, 'GEN') },
  loading: false,
  error: '',
};

function countOccupied(beds) {
  return beds.filter((bed) => bed.occupied).length;
}

function bedReducer(state, action) {
  switch (action.type) {
    case 'ASSIGN_BED': {
      const { ward, bedId, patientId } = action.payload;
      const key = ward === 'ICU' ? 'icu' : 'general';
      return {
        ...state,
        [key]: {
          ...state[key],
          beds: state[key].beds.map((bed) =>
            bed.id === bedId && !bed.occupied ? { ...bed, occupied: true, patientId } : bed
          ),
        },
      };
    }
    case 'RELEASE_BED': {
      const { ward, bedId } = action.payload;
      const key = ward === 'ICU' ? 'icu' : 'general';
      return {
        ...state,
        [key]: {
          ...state[key],
          beds: state[key].beds.map((bed) =>
            bed.id === bedId ? { ...bed, occupied: false, patientId: null } : bed
          ),
        },
      };
    }
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export function BedProvider({ children }) {
  const [state, dispatch] = useReducer(bedReducer, initialState);

  const assignBed = useCallback((ward, bedId, patientId) => {
    dispatch({ type: 'ASSIGN_BED', payload: { ward, bedId, patientId } });
  }, []);

  const releaseBed = useCallback((ward, bedId) => {
    dispatch({ type: 'RELEASE_BED', payload: { ward, bedId } });
  }, []);

  const getAvailableBeds = useCallback(
    (ward) => {
      const key = ward === 'ICU' ? 'icu' : 'general';
      return state[key].beds.filter((bed) => !bed.occupied);
    },
    [state]
  );

  const stats = useMemo(() => {
    const icuOccupied = countOccupied(state.icu.beds);
    const generalOccupied = countOccupied(state.general.beds);
    const totalOccupied = icuOccupied + generalOccupied;
    const totalCapacity = state.icu.total + state.general.total;
    const totalAvailable = totalCapacity - totalOccupied;

    return {
      icu: { total: state.icu.total, occupied: icuOccupied, available: state.icu.total - icuOccupied },
      general: { total: state.general.total, occupied: generalOccupied, available: state.general.total - generalOccupied },
      totalOccupied,
      totalAvailable,
      utilization: Math.round((totalOccupied / totalCapacity) * 100),
    };
  }, [state]);

  return (
    <BedContext.Provider
      value={{
        icu: { ...state.icu, occupied: stats.icu.occupied },
        general: { ...state.general, occupied: stats.general.occupied },
        stats,
        totalAvailable: stats.totalAvailable,
        loading: state.loading,
        error: state.error,
        assignBed,
        releaseBed,
        getAvailableBeds,
      }}
    >
      {children}
    </BedContext.Provider>
  );
}

export function useBeds() {
  const ctx = useContext(BedContext);
  if (!ctx) throw new Error('useBeds must be used within BedProvider');
  return ctx;
}

export default BedContext;
