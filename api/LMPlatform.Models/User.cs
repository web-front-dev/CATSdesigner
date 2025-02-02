﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Application.Core.Data;
using LMPlatform.Models.KnowledgeTesting;
using Newtonsoft.Json;

namespace LMPlatform.Models
{
	public class User : ModelBase
	{
		public virtual ICollection<Concept> Concept { get; set; }

		public string UserName { get; set; }

		public Membership Membership { get; set; }

		public bool? IsServiced { get; set; }

		public Student Student { get; set; }

		public Lecturer Lecturer { get; set; }

		public ICollection<UserNote> PersonalNotes { get; set; }

		public ICollection<ProjectUser> ProjectUsers { get; set; }

		public ICollection<ProjectComment> ProjectComments { get; set; }

		public ICollection<Project> Projects { get; set; }

		public ICollection<Bug> Bugs { get; set; }

		public ICollection<Note> Notes { get; set; }

		public ICollection<Bug> DeveloperBugs { get; set; }

		public ICollection<AnswerOnTestQuestion> UserAnswersOnTestQuestions { get; set; }

		public ICollection<TestPassResult> TestPassResults { get; set; }

		public ICollection<UserMessages> Messages { get; set; }

		public ICollection<Attachment> Attachments { get; set; }

		public ICollection<Documents> Documents { get; set; }

		public ICollection<Attendance> Attendances { get; set; }

		public virtual DateTime? LastLogin { get; set; }
        public string Avatar { get; set; }

		[NotMapped]
		public string FullName
		{
			get
			{
				if (Student != null)
					return Student.FullName.Trim(' ');
				if (Lecturer != null) return Lecturer.FullName.Trim(' ');

				return UserName;
			}
		}

		public string SkypeContact { get; set; }

		public string Email { get; set; }

		public string Phone { get; set; }

		public string About { get; set; }

        	public string Answer { get; set; }

        	public int? QuestionId { get; set; }

		public DateTime? AddedOn { get; set; }
    }
}
