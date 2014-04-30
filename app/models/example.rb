class Example < ActiveRecord::Base
  belongs_to :chapter
  default_scope :order => 'number'

  before_save :set_template, :set_number

  def set_number
    if self.number.nil?
      if self.chapter.nil?
        self.number = 0
      else
        self.number = self.chapter.examples.count + 1
      end
    end
  end

  def set_template
    unless self.template_name
      self.template_name = "#{chapter.url_tag}__#{url_tag}"
      #touch files
      File.open("#{Rails.root}/app/views/examples/template/_#{self.template_name}.js", 'w') do |f|
        f.write("/** Example:  #{self.name.parameterize} **/")
      end
      File.open("#{Rails.root}/app/views/examples/template/_#{self.template_name}_content.html", 'w') do |f|
        f.write("<!-- Example:  #{self.name.parameterize} -->")
      end
    end
  end

  def url_tag
    self.name.parameterize.underscore
  end
end
