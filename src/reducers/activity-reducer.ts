import { Activity } from '../types/index';

export type ActivityState = {
    activities: Activity[]
    activeId: Activity['id']
}

export type ActivityActions = 
    { type: 'save-activity', payload: { newActivity: Activity} } | 
    { type: 'set-activeId', payload: { id: Activity['id']} } |
    { type: 'delete-activity', payload: { id: Activity['id']}} |
    { type: 'restar-app'} 


// Validate if there are somthing on localStorage
const localStorageActivities = () : Activity[] => {
    const activities = localStorage.getItem('activities')
    return activities ? JSON.parse(activities) : []
}

export const initialState : ActivityState = {
    activities: localStorageActivities(),
    activeId: ''
}

export const activityReducer = ( 
    state: ActivityState = initialState, 
    action: ActivityActions
) => {
    if(action.type == 'save-activity'){
        // Antes del return se ejecutará la lógica que deseemos
        let updateActivity : Activity[] = []
        if(state.activeId){
            updateActivity = state.activities.map( activity => 
                activity.id === state.activeId ? 
                    action.payload.newActivity : 
                    activity 
                );
        }else {
            updateActivity = [...state.activities, action.payload.newActivity]
        }
        return {
            ...state,
            activities: updateActivity,
            activeId: ''
        }
    }

    if(action.type == 'set-activeId'){
        return {
            ...state, 
            activeId: action.payload.id
        }
    }

    if(action.type == 'delete-activity'){
        let activities = state.activities.filter( activity => activity.id !== action.payload.id);
        return {
            ...state,
            activities: activities
        }
    }

    if(action.type == 'restar-app'){
        return {
            activities: [],
            activeId: ''
        }
    }

    return state
}