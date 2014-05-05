module ApplicationHelper
  def edit_mode_enabled?
    ApplicationHelper.edit_mode_enabled?
  end

  def self.edit_mode_enabled?
    ['development','test'].include? Rails.env
  end

end
