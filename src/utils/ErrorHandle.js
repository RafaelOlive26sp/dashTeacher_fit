import SnackBarsView from "@/components/snackBar/SnackBarsView.vue";

export function handleError(error, context = '') 
{
    //Mostra no console apenas em desenvolvimento
    if (import.meta.env.DEV) 
    {
        console.error(`Error in ${context}:`, error.response.data.message);
    }


    //Envia para API de logs em produção
    fetch('/api/logs',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: error.message,
            stack: error.stack,
            context: context,
            time: new Date().toISOString(),
        }),
    }).catch(err => {
        if (import.meta.env.DEV)
        {
            console.warn('Failed to send error log:', err);
        }
    });

    
}