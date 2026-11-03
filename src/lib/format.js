const dateFmt = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export const formatDate = (iso) => dateFmt.format(new Date(`${iso}T00:00:00`));
export const formatNumber = (n) => n.toLocaleString('en-IN');
export const todayISO = () => new Date().toISOString().slice(0, 10);
export const isUpcoming = (event) => event.date >= todayISO();
