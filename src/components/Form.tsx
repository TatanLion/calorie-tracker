import { useState, ChangeEvent, FormEvent, Dispatch, useEffect } from "react"
import { categories } from "../data/categories"
import type { Activity } from "../types"
import { ActivityActions, ActivityState } from "../reducers/activity-reducer"

type FormProps = {
    state: ActivityState
    dispatch: Dispatch<ActivityActions>
}

const getFormattedDate = () => {
    const date = new Date();
    return date.toISOString().split('T')[0];
};

// Funcion que mantiene cual sería el estado inicial
const createNewActivity = (): Activity => ({
    id: crypto.randomUUID(),
    category: 1,
    name: '',
    calories: 0,
    date: getFormattedDate()
});

// Iniciamos el state con la informacion
const initialState: Activity = createNewActivity();

export default function Form({ state, dispatch }: FormProps) {

    // Se genera el arreglo del state con los mismos id de los input para guardarlo mas fácil
    const [activity, setActivity] = useState<Activity>(initialState)

    useEffect(() => {
        if (state.activeId) {
            const selectedActivity = state.activities.filter(stateActivity => stateActivity.id == state.activeId)[0]
            setActivity(selectedActivity)
        }
    }, [state.activeId])

    const handleChange = (e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        const isNumberField = ['category', 'calories'].includes(e.target.id)
        setActivity({
            ...activity,
            [id]: isNumberField ? +value : value
        })
    }

    const isValidActivity = () => {
        const { name, calories } = activity;
        return name.trim() !== '' && calories > 0
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        // Guardamos en el state con useReducer
        dispatch({ type: 'save-activity', payload: { newActivity: activity } })
        setActivity(createNewActivity())
    }

    return (
        <form
            className="space-y-5 bg-white shadow p-10 rounded-lg"
            onSubmit={handleSubmit}
        >
            <div className="grid grid-cols-1 gap-3">
                <label htmlFor="category" className="font-bold">Categoría:</label>
                <select
                    id="category"
                    className="border border-slate-300 p-2 rounded-lg w-full bg-white"
                    value={activity.category}
                    onChange={(e) => handleChange(e)}
                >
                    {categories.map(category => (
                        <option
                            key={category.id}
                            value={category.id}
                            className=""
                        >
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 gap-3">
                <label htmlFor="name" className="font-bold">Actividad:</label>
                <input
                    type="text"
                    id="name"
                    className="border border-slate-300 p-2 rounded-lg"
                    placeholder="Ej. Comida, Jugo de Naranja, Ensalada, Ejercicio, etc."
                    value={activity.name}
                    onChange={(e) => handleChange(e)}
                />
            </div>

            <div className="grid grid-cols-1 gap-3">
                <label htmlFor="calories" className="font-bold">Calorias:</label>
                <input
                    type="number"
                    id="calories"
                    className="border border-slate-300 p-2 rounded-lg"
                    placeholder="Ej. 300, 500"
                    value={activity.calories}
                    onChange={(e) => handleChange(e)}
                />
            </div>

            <div className="grid grid-cols-1 gap-3">
                <label htmlFor="date" className="font-bold">Fecha:</label>
                <input
                    type="date"
                    id="date"
                    className="border border-slate-300 p-2 rounded-lg"
                    value={activity.date}
                    onChange={handleChange}
                />
            </div>

            <input
                type="submit"
                value={`${activity.category == 1 ? 'Guardar Comida' : 'Guardar Ejercicio'}`}
                className="bg-gray-800 hover:bg-gray-900 w-full p-2 font-bold uppercase text-white cursor-pointer disabled:opacity-20 disabled:pointer-events-none"
                disabled={!isValidActivity()}
            />

        </form>
    )
}
