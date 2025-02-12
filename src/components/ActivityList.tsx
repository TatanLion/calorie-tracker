import { Dispatch, useCallback, useMemo, useState } from "react"
import { Activity } from "../types"
import { categories } from "../data/categories"
import { PencilSquareIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { ActivityActions } from "../reducers/activity-reducer"

type ActivityListProps = {
    activities: Activity[]
    dispatch: Dispatch<ActivityActions>
}

export default function ActivityList({ activities, dispatch }: ActivityListProps) {

    const [ valueSearch, setValueSearch ] = useState<string>('')

    const formatDate = useCallback(() => (dateString: string): string => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
    }, [activities])

    const categoryName = useMemo(() => (category: Activity['category']) =>
        categories.map(cat => cat.id == category ? cat.name : ''),
        [activities]);

    const isEmptyActivities = useMemo(() => activities.length === 0, [activities]);

    const filterActivities = useMemo(() => {
        return activities.filter(activity => 
            activity.name.toLowerCase().includes(valueSearch.trim().toLowerCase())
        );
    }, [activities, valueSearch]);

    const handleEdit = (id: Activity['id']) => {
        dispatch({ type: 'set-activeId', payload: { id: id } })
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    const handleDelete = (id : Activity['id']) => {
        dispatch({ type: 'delete-activity', payload: { id: id } })
    }

    return (
        <>
            <h2 className="text-4xl font-bold text-slate-600 text-center">Comida y Actividades</h2>

            {isEmptyActivities ?
                <p className="text-center text-lg my-5 text-slate-600 font-bold">No hay actividades áun</p> :
                <>
                    <form className="max-w-md mx-auto my-8">   
                        <label htmlFor="default-search" className="mb-2 text-md font-medium text-gray-900 sr-only dark:text-white">Search</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                </svg>
                            </div>
                            <input type="search" id="default-search" className="block w-full p-4 ps-10 text-md text-gray-900 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Search Activity" onChange={(e) => setValueSearch(e.target.value)} value={valueSearch} />
                            <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-gray-800 hover:bg-gray-900 font-medium rounded-lg text-md px-4 py-2">Search</button>
                        </div>
                    </form>
                    {filterActivities.map(activity => (
                        <div
                            key={activity.id}
                            className="px-5 py-10 bg-white mt-5 flex justify-between shadow"
                        >
                            <div className="space-y-2 relative">
                                <p className={`absolute -top-8 -left-8 px-10 py-2 text-white uppercase font-bold ${activity.category == 1 ? 'bg-lime-500' : 'bg-orange-500'}`}>
                                    {categoryName(activity.category)}
                                </p>
                                <p className="text-2xl font-bold pt-5">{activity.name}</p>
                                <p className="font-black text-4xl text-lime-500">
                                    {activity.calories} {''}
                                    <span>Calorias</span>
                                </p>
                                <p className="text-xl font-bold pt-5">{formatDate()(activity.date)}</p>
                            </div>

                            <div className="flex gap-4 items-center">
                                <button
                                    onClick={() => handleEdit(activity.id)}
                                >
                                    <PencilSquareIcon
                                        className="h-8 w-8 text-gray-800"
                                    />
                                </button>
                                <button
                                    onClick={() => handleDelete(activity.id)}
                                >
                                    <XCircleIcon
                                        className="h-8 w-8 text-red-500"
                                    />
                                </button>
                            </div>

                        </div>
                    ))}
                </>
            }

        </>
    )
}
