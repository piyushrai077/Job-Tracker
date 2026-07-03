function JobCard({ job, onDelete, onStatusChange, onEdit }) {
  return (
<div className="job-card" data-status={job.status}>
      <h3>{job.company_name}</h3>
      <p>{job.role}</p>
      <p className="job-date">Applied: {job.applied_date?.slice(0, 10)}</p>
      {job.notes && <p className="job-notes">{job.notes}</p>}

      <div className="job-card-actions">
        <select value={job.status} onChange={(e) => onStatusChange(job.id, e.target.value)}>
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>
        <button onClick={() => onEdit(job)}>Edit</button>
        <button onClick={() => onDelete(job.id)}>Delete</button>
      </div>
    </div>
  );
}

export default JobCard;