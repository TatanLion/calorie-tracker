import { useEffect, useMemo, useReducer, useState } from 'react';
import Form from './components/Form';
import { initialState, activityReducer } from './reducers/activity-reducer';
import ActivityList from './components/ActivityList';
import { CalorieTracker } from './components/CalorieTracker';
import ShowSummary from './components/ShowSummary';


function App() {

  const [state, dispatch] = useReducer(activityReducer, initialState);

  // State to show summary
  const [showSummary, setShowSummary] = useState<boolean>(false);

  // Save on localStorage
  useEffect(() => {
    localStorage.setItem('activities', JSON.stringify(state.activities))
  }, [state.activities])

  const canRestartApp = useMemo(() => state.activities.length > 0, [state.activities])

  const handleShowSummary = () => {
    setShowSummary(true);
  }

  const isEmptyActivities = useMemo(() => state.activities.length === 0, [state.activities]);

  return (
    <>
      {showSummary && (
        <ShowSummary 
          activities={state.activities}
          setShowSummary={setShowSummary} 
        />
      )}
      <div className={`${showSummary ? 'blur-[7px] pointer-events-none' : 'blur-0 pointer-events-auto'}`}>
        <header className="bg-lime-600 py-3">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <h1 className="text-center text-lg font-bold text-white uppercase">Contador de Calorias</h1>
            <button
              className='bg-gray-800 hover:bg-gray-900 p-2 font-bold uppercase text-white cursor-pointer rounded-lg text-sm disabled:opacity-50 disabled:pointer-events-none'
              disabled={!canRestartApp}
              onClick={() => dispatch({ type: 'restar-app' })}
            >
              Reiniciar App
            </button>
          </div>
        </header>
      
        <section className="bg-lime-500 py-20 px-5">
          <div className="max-w-4xl mx-auto">
            <Form
              state={state}
              dispatch={dispatch}
            />
          </div>
        </section>
      
        <section className='bg-gray-800 py-10'>
          <div className="max-w-4xl mx-auto mb-5">
            <CalorieTracker
              activities={state.activities}
            />
          </div>
          <button 
            className='bg-green-700 hover:bg-green-600 text-white font-semibold px-5 py-2 w-max mx-auto flex justify-center disabled:pointer-events-none disabled:opacity-40' onClick={() => handleShowSummary()}
            disabled={isEmptyActivities}
          >
            Ver Historial
          </button>
        </section>
      
        <section className="p-10 mx-auto max-w-4xl">
          <ActivityList
            activities={state.activities}
            dispatch={dispatch}
          />
        </section>
      </div>
    </>
  )
}

export default App
