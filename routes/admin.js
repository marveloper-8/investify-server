const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const moment = require('moment')
const nodemailer = require('nodemailer')
const requireAdminLogin = require('../middleware/requireAdminLogin')

const Admin = mongoose.model("Admin")

const {EMAIL,CONTACT_EMAIL ,PASSWORD, HOST, JWT_SECRET} = require('../config/keys')

var passwordTransporter = nodemailer.createTransport({
    host: HOST,
    port: 465,
    secure: true,
    auth: {
      user: EMAIL,
      pass: PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
})

router.post('/signup-admin', (req, res) => {
    const {
        appMode,
        email,
        password
    } = req.body
    if(!email || !password){
        return res.status(422).json({error: "Please add all the fields"})
    }
    Admin.findOne({email: email})
        .then((savedAdmin) => {
            if(savedAdmin){
                return res.status(422).json({error: "Admin already exists with that email"})
            }
            bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const admin = new Admin({
                        appMode,
                        email,
                        password: hashedPassword,

                    })
                    admin.save()
                        .then(admin => {
                            res.json({message: "Saved successfully"})
                        })
                        .catch(err => {
                            console.log(err)
                        })

                })
        })
        .catch(err => {
            console.log(err)
        })
})

router.post('/signin-admin', (req, res) => {
    const {email, password} = req.body
    if(!email || !password){
        return res.status(422).json({error: "Please add email or password"})
    }
    Admin.findOne({email:email})
        .then(savedAdmin => {
            if(!savedAdmin){
                return res.status(422).json({error: "Invalid email or password"})
            }
            bcrypt.compare(password, savedAdmin.password)
                .then(doMatch => {
                    if(doMatch){
                        // return res.json({message: "Successfully logged in"})
                        const token = jwt.sign({_id: savedAdmin._id}, JWT_SECRET)
                        const {
                            _id, 
                            appMode,
                            email
                        } = savedAdmin
                        return res.json({token, admin:{
                            _id, 
                            appMode,
                            email
                        }})
                    }
                    else{
                        return res.status(422).json({error: "Invalid email or password"})
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        })
})

router.post('/reset-password-admin',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }
        
        const token = buffer.toString("hex")
        Admin.findOne({email:req.body.email})
        .then(admin=>{
            if(!admin){
                return res.status(422).json({error:"Admin dont exists with that email"})
            }
            admin.resetToken = token
            admin.expireToken = Date.now() + 3600000
            admin.save().then((result)=>{

                let mailOptions =  {
                    to:admin.email,
                    from:'"Investify Africa" <password@firstclassbrain.com>',
                    subject:"Password reset request",
                    html:   `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
                      <head>
                    
                        <!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
                        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                        <meta name="viewport" content="width=device-width">
                    
                        <!--[if !mso]>
                    <!-->
                        <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    
                        <!--<![endif]-->
                        <title></title>
                    
                        <!--[if !mso]>
                    <!-->
                        <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" type="text/css">
                        <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css">
                        <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" type="text/css">
                        <link href="https://fonts.googleapis.com/css?family=Varela+Round" rel="stylesheet" type="text/css">
                        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&amp;display=swap" rel="stylesheet" type="text/css">
                        <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css">
                    
                        <!--<![endif]-->
                        <style type="text/css">
                          body {
                            margin: 0;
                            padding: 0;
                          }
                          table,
                          td,
                          tr {
                            vertical-align: top;
                            border-collapse: collapse;
                          }
                          * {
                            line-height: inherit;
                          }
                          a[x-apple-data-detectors=true] {
                            color: inherit !important;
                            text-decoration: none !important;
                          }
                        </style>
                        <style type="text/css" id="media-query">
                          @media (max-width: 670px) {
                            .block-grid,
                            .col {
                              min-width: 320px !important;
                              max-width: 100% !important;
                              display: block !important;
                            }
                            .block-grid {
                              width: 100% !important;
                            }
                            .col {
                              width: 100% !important;
                            }
                            .col>div {
                              margin: 0 auto;
                            }
                            img.fullwidth,
                            img.fullwidthOnMobile {
                              max-width: 100% !important;
                            }
                            .no-stack .col {
                              min-width: 0 !important;
                              display: table-cell !important;
                            }
                            .no-stack.two-up .col {
                              width: 50% !important;
                            }
                            .no-stack .col.num4 {
                              width: 33% !important;
                            }
                            .no-stack .col.num8 {
                              width: 66% !important;
                            }
                            .no-stack .col.num4 {
                              width: 33% !important;
                            }
                            .no-stack .col.num3 {
                              width: 25% !important;
                            }
                            .no-stack .col.num6 {
                              width: 50% !important;
                            }
                            .no-stack .col.num9 {
                              width: 75% !important;
                            }
                            .video-block {
                              max-width: none !important;
                            }
                            .mobile_hide {
                              min-height: 0px;
                              max-height: 0px;
                              max-width: 0px;
                              display: none;
                              overflow: hidden;
                              font-size: 0px;
                            }
                            .desktop_hide {
                              display: block !important;
                              max-height: none !important;
                            }
                          }
                        </style>
                      </head>
                      <body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #f7f7f7;"><img alt="" src="http://bee.musvc2.net/e/c?q=A%3dOYFfO%26G%3d0%26L%3dKbBY%267%3db9aKZ%26o%3d9s6haOdACQW8-AP6B-bL8l-gtcG-aOciaw9DdsA9%26GA%3dX0cNe9%26B%3d5PzTuW.uCB%26O%3d-8cJV8ZQY8b" width="1" height="1" border="0" style="mso-hide:all;display:none!important;min-height:1px!important;width:1px!important;border-width:0!important;margin-top:0!important;margin-bottom:0!important;margin-right:0!important;margin-left:0!important;padding-top:0!important;padding-bottom:0!important;padding-right:0!important;padding-left:0!important">
                    
                        <!--[if IE]><div class="ie-browser"><![endif]-->
                        <table class="nl-container" style="table-layout: fixed; vertical-align: top; min-width: 320px; Margin: 0 auto; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f7f7f7; width: 100%;" cellpadding="0" cellspacing="0" role="presentation" width="100%" bgcolor="#f7f7f7" valign="top">
                          <tbody>
                            <tr style="vertical-align: top;" valign="top">
                              <td style="word-break: break-word; vertical-align: top;" valign="top">
                    
                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:#f7f7f7"><![endif]-->
                                <div style="background-color:#f7f7f7;">
                                  <div class="block-grid " style="Margin: 0 auto; min-width: 320px; max-width: 650px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
                                    <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                    
                                      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f7f7f7;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                    
                                      <!--[if (mso)|(IE)]><td align="center" width="650" style="background-color:transparent;width:650px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 30px; padding-left: 30px; padding-top:25px; padding-bottom:0px;"><![endif]-->
                                      <div class="col num12" style="min-width: 320px; max-width: 650px; display: table-cell; vertical-align: top; width: 650px;">
                                        <div style="width:100% !important;">
                    
                                          <!--[if (!mso)&(!IE)]>
                    <!-->
                                          <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:25px; padding-bottom:0px; padding-right: 30px; padding-left: 30px;">
                    
                                            <!--<![endif]-->
                                            <div class="img-container center fixedwidth" align="center" style="padding-right: 5px;padding-left: 5px;">
                    
                                              <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 5px;padding-left: 5px;" align="center"><![endif]-->
                                              <div style="font-size:1px;line-height:5px">&nbsp;</div><img class="center fixedwidth" align="center" border="0" src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/BeeProAgency/53601_111631/EDB_welcome/emaildesign_beefree.png" alt="Email Design Blog Logo" title="Email Design Blog Logo" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 147px; display: block;" width="147">
                                              <div style="font-size:1px;line-height:5px">&nbsp;</div>
                    
                                              <!--[if mso]></td></tr></table><![endif]-->
                                            </div>
                    
                                            <!--[if (!mso)&(!IE)]>
                    <!-->
                                          </div>
                    
                                          <!--<![endif]-->
                                        </div>
                                      </div>
                    
                                      <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                    
                                      <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                    </div>
                                  </div>
                                </div>
                                <div style="background-color:transparent;">
                                  <div class="block-grid " style="Margin: 0 auto; min-width: 320px; max-width: 650px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
                                    <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                    
                                      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                    
                                      <!--[if (mso)|(IE)]><td align="center" width="650" style="background-color:transparent;width:650px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:40px; padding-bottom:0px;"><![endif]-->
                                      <div class="col num12" style="min-width: 320px; max-width: 650px; display: table-cell; vertical-align: top; width: 650px;">
                                        <div style="width:100% !important;">
                    
                                          <!--[if (!mso)&(!IE)]>
                    <!-->
                                          <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:40px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
                    
                                            <!--<![endif]-->
                    
                                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 5px; padding-left: 5px; padding-top: 0px; padding-bottom: 0px; font-family: 'Trebuchet MS', Tahoma, sans-serif"><![endif]-->
                                            <div style="color:#38383b;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;line-height:1.2;padding-top:0px;padding-right:5px;padding-bottom:0px;padding-left:5px;">
                                              <div style="line-height: 1.2; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; font-size: 12px; color: #38383b; mso-line-height-alt: 14px;">
                                                <p style="line-height: 1.2; font-size: 38px; word-break: break-word; text-align: center; font-family: Montserrat, 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 46px; margin: 0;"><span style="font-size: 38px;"><strong><span>Reset Password!</span></strong></span></p>
                                              </div>
                                            </div>
                    
                                            <!--[if mso]></td></tr></table><![endif]-->
                    
                                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 0px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
                                            <div style="color:#555555;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.5;padding-top:0px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                              <div style="font-size: 14px; line-height: 1.5; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; color: #555555; mso-line-height-alt: 21px;">
                                                <p style="font-size: 18px; line-height: 1.5; text-align: center; word-break: break-word; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 27px; margin: 0;"><span style="font-size: 18px;">Hello there. You are receiving this because you <span style="font-size: 18px; font-weight:bolder; color:#f00;">or someone else have requested</span> to reset your account's password on Investify Africa. Click on the link below to reset your password. If it doesn't redirect you to the reset password page on Investify Africa, copy and paste the link into your browser.</span>
                                              </div>
                                            </div>
                                            <div style="color:#555555;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.5;padding-top:0px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                <div style="font-size: 14px; line-height: 1.5; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; color: #555555; mso-line-height-alt: 21px;">
                                                <p style="font-size: 18px; line-height: 1.5; text-align: center; word-break: break-word; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 27px; margin: 0;"><span style="font-size: 18px;"></span><span style="font-size: 18px; font-weight:bolder; color:teal;">https://investify.africa/${token}</span>
                                                </div>
                                            </div>
                                            <div style="color:#555555;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.5;padding-top:0px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                <div style="font-size: 14px; line-height: 1.5; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; color: #555555; mso-line-height-alt: 21px;">
                                                <p style="font-size: 18px; line-height: 1.5; text-align: center; word-break: break-word; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 27px; margin: 0;"><span style="font-size: 18px;"></span>Ignore this email if it wasn't requested by you.</div>
                                            </div>
                    
                                            <!--[if mso]></td></tr></table><![endif]-->
                                            <div class="img-container center fixedwidth" align="center" style="padding-right: 0px;padding-left: 0px;">
                    
                                              <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]-->
                                              <div style="font-size:1px;line-height:15px">&nbsp;</div><img class="center fixedwidth" align="center" border="0" src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/BeeProAgency/53601_111631/EDB_set/Welcome.png" alt="Email Say Hi" title="Email Say Hi" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 540px; display: block;" width="540">
                    
                                              <!--[if mso]></td></tr></table><![endif]-->
                                            </div>
                    
                                            <!--[if (!mso)&(!IE)]>
                    <!-->
                                          </div>
                    
                                          <!--<![endif]-->
                                        </div>
                                      </div>
                    
                                      <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                    
                                      <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                    </div>
                                  </div>
                                </div>
                                <div style="background-color:transparent;">
                                  <div class="block-grid " style="Margin: 0 auto; min-width: 320px; max-width: 650px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
                                    <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                    
                                      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                    
                                      <!--[if (mso)|(IE)]><td align="center" width="650" style="background-color:transparent;width:650px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                                      <div class="col num12" style="min-width: 320px; max-width: 650px; display: table-cell; vertical-align: top; width: 650px;">
                                        <div style="width:100% !important;">
                    
                                          <!--[if (!mso)&(!IE)]>
                    <!-->
                                          <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                    
                                            <!--<![endif]-->
                                            <table class="divider" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" role="presentation" valign="top">
                                              <tbody>
                                                <tr style="vertical-align: top;" valign="top">
                                                  <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 35px; padding-right: 35px; padding-bottom: 35px; padding-left: 35px;" valign="top">
                                                    <table class="divider_content" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 5px; width: 100%;" align="center" role="presentation" height="5" valign="top">
                                                      <tbody>
                                                        <tr style="vertical-align: top;" valign="top">
                                                          <td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" height="5" valign="top"><span></span></td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                    
                                            <!--[if (!mso)&(!IE)]>
                    <!-->
                                          </div>
                    
                                          <!--<![endif]-->
                                        </div>
                                      </div>
                    
                                      <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                    
                                      <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                    </div>
                                  </div>
                                </div>
                                <div style="background-color:#FFFFFF;">
                                  <div class="block-grid " style="Margin: 0 auto; min-width: 320px; max-width: 650px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
                                    <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                    
                                      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#FFFFFF;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                    
                                      <!--[if (mso)|(IE)]><td align="center" width="650" style="background-color:transparent;width:650px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 20px; padding-left: 20px; padding-top:40px; padding-bottom:25px;"><![endif]-->
                                      <div class="col num12" style="min-width: 320px; max-width: 650px; display: table-cell; vertical-align: top; width: 650px;">
                                        <div style="width:100% !important;">
                    
                                          <!--[if (!mso)&(!IE)]>
                    <!-->
                                          <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:40px; padding-bottom:25px; padding-right: 20px; padding-left: 20px;">
                    
                                            <!--<![endif]-->
                                            <div class="img-container center fixedwidth fullwidthOnMobile" align="center" style="padding-right: 0px;padding-left: 0px;">
                    
                                              <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img class="center fixedwidth fullwidthOnMobile" align="center" border="0" src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/BeeProAgency/53601_111631/EDB_welcome/Emaildesignblog_logo.png" alt="Email Design Blog Logo" title="Email Design Blog Logo" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 305px; display: block;" width="305">
                                              <div style="font-size:1px;line-height:5px">&nbsp;</div>
                    
                                              <!--[if mso]></td></tr></table><![endif]-->
                                            </div>
                    
                                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
                    
                                            <!--[if mso]></td></tr></table><![endif]-->
                                            <table class="social_icons" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" valign="top">
                                              <tbody>
                                                <tr style="vertical-align: top;" valign="top">
                                                  <td style="word-break: break-word; vertical-align: top; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
                                                    <table class="social_table" align="center" cellpadding="0" cellspacing="0" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-tspace: 0; mso-table-rspace: 0; mso-table-bspace: 0; mso-table-lspace: 0;" valign="top">
                                                      <tbody>
                                                        <tr style="vertical-align: top; display: inline-block; text-align: center;" align="center" valign="top">
                                                          <td style="word-break: break-word; vertical-align: top; padding-bottom: 0; padding-right: 7.5px; padding-left: 7.5px;" valign="top"><a href="http://bee.musvc2.net/e/t?q=6%3dCZVaC%26H%3dP%26G%3d9cRT%26u%3dcOV9a%26H%3dAzPCL_xwps_97_EtYv_O9_xwps_8BJP3.Bx6k8BHq.9BF_xwps_8By8kBE8kEB_KWym_VlQGF_yKHKiA_EtYv_P7kIxBr_02LoCA_5rK4_KWym_UBQGF_sA1B1I_EtYv_P7kIxBr_NnvV_XSNzI_z4sLxBmJ_EtYv_P73A96uI2-8s76E-jAFBmJ-yEuC-4g7x2FgE9-6uJ3BxIxMoKA%267%3dsQFOiX.A8z%26EF%3dV9aSc8" target="_blank"><img width="32" height="32" src="http://bee.img.musvc2.net/static/74987/images/social/circle-dark-gray/facebook@2x.png" alt="Facebook" title="Facebook" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; display: block;"></a></td>
                                                          <td style="word-break: break-word; vertical-align: top; padding-bottom: 0; padding-right: 7.5px; padding-left: 7.5px;" valign="top"><a href="http://bee.musvc2.net/e/t?q=4%3dJWDYJ%26E%3d8%26E%3dFZ0R%262%3dZ7TFX%26z%3d97MuJ_5tXq_F4_wrfs_77_5tXq_E9yNvMy65.6tD_5tXq_E9g6r9w6rBt_IdvU_TsNyD_6HzIp8_wrfs_85rFf0y_7jJv0s_3yHl_IdvU_SINyD_z8i08F_wrfs_85rFf0y_KVtc_UAL7F_h2zIf0tG_wrfs_8508q42Fj-6z4nC-q8x0tG-gC20-jDnBq2n4f-42Gk05FfKvHs%265%3dzNxMpU.s67%26Bx%3dTFXAaE" target="_blank"><img width="32" height="32" src="http://bee.img.musvc2.net/static/74987/images/social/circle-dark-gray/twitter@2x.png" alt="Twitter" title="Twitter" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; display: block;"></a></td>
                                                          <td style="word-break: break-word; vertical-align: top; padding-bottom: 0; padding-right: 7.5px; padding-left: 7.5px;" valign="top"><a href="http://bee.musvc2.net/e/t?q=5%3dKW9ZK%26E%3d3%26F%3dGZ5S%263%3dZ2UGX%26u%3d08MpK_6tSr_G4_rsgs_28_6tSr_F9wOA.BnK84gJoF.cG1_KQud_Uf4s8fJs8.iG_6tSr_F9_rsgs_389Mm_K3Nr5s_KQud_Vd714iD_r8sAuG_bD30_rsgs_2X9Mm_Es7iM1_KQud_Vd714iD_6tSr_FYuL1_6aE44i92_KQud_VdOsEcG18-eEoBl-6s3o4aLi92-5lGu-8m3wE-cG29iJ14tA3G%26d%3dE9Lv5F.GeL%26wL%3d3UIY0T" target="_blank"><img width="32" height="32" src="http://bee.img.musvc2.net/static/74987/images/social/circle-dark-gray/instagram@2x.png" alt="Instagram" title="Instagram" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; display: block;"></a></td>
                                                          <td style="word-break: break-word; vertical-align: top; padding-bottom: 0; padding-right: 7.5px; padding-left: 7.5px;" valign="top"><a href="http://bee.musvc2.net/e/t?q=9%3dKVVdK%26D%3dP%26J%3dGYRW%263%3dYOYGW%26H%3dD8LCO_6spv_G3_Ewgr_OB_6spv_F8JSA.QBQ8MyA.qG0_Neum_Xt5572F2H_6spv_F8rivGkeLqmHdVJfuu-3ExbIOO_Jnyd_U3Q8E_FK9JzA_6spv_G62IoA9_0sK6C2_49Ku_Jnyd_TSQ8E_0ArAHI_6spv_G62IoA9_Neum_XJMGI_q30LoA4J_6spv7o3x_G6JAz5BIs-707wD-1A7A4J-pDBC-sExEz-5BJtAEIoL6K2%266%3d0Q7NzX.27G%26E7%3dUPaJbO" target="_blank"><img width="32" height="32" src="http://bee.img.musvc2.net/static/74987/images/social/circle-dark-gray/youtube@2x.png" alt="YouTube" title="YouTube" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; display: block;"></a></td>
                                                          <td style="word-break: break-word; vertical-align: top; padding-bottom: 0; padding-right: 7.5px; padding-left: 7.5px;" valign="top"><a href="http://bee.musvc2.net/e/t?q=5%3dDbQZD%26J%3dK%26F%3d0eMS%26v%3deJU0c%26C%3d01R8K_yykr_09_0sZx_J8_yykr_9DEO4.J1FrCvAu.A7E_yykr_9DuGtNsF6_PiuW_Zx4lC-w6pR7J_yykr_0DCLt_Q7MyAw_JX1h_UkC53pJ_v7zGyF_iJ79_yykr_9dCLt_Kw6pS5_JX1h_UkC53pJ_0sZx_JX2R5_5hK83pE6_JX1h_UkUwDjM57-lK3h9ssAs-BwKpE6-4sMy-7t91D-jM68pP531G7F%26k%3dKCK3AJ.FlR%261K%3d0aMXGZ" target="_blank"><img width="32" height="32" src="http://bee.img.musvc2.net/static/74987/images/social/circle-dark-gray/linkedin@2x.png" alt="LinkedIn" title="LinkedIn" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; display: block;"></a></td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                    
                                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 15px; padding-left: 15px; padding-top: 15px; padding-bottom: 15px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
                    
                                            <!--[if mso]></td></tr></table><![endif]-->
                                            <table class="divider" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" role="presentation" valign="top">
                                              <tbody>
                                                <tr style="vertical-align: top;" valign="top">
                                                  <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
                                                    <table class="divider_content" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px dotted #E4E4E4; width: 100%;" align="center" role="presentation" valign="top">
                                                      <tbody>
                                                        <tr style="vertical-align: top;" valign="top">
                                                          <td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                    
                                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
                                            <div style="color:#807e7e;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.5;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                              <div style="font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; font-size: 12px; line-height: 1.5; color: #807e7e; mso-line-height-alt: 18px;">
                                                <p style="font-size: 13px; line-height: 1.5; word-break: break-word; text-align: center; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 20px; mso-ansi-font-size: 14px; margin: 0;"><span style="font-size: 13px; mso-ansi-font-size: 14px;">You received this message on <a style="text-decoration: underline; color: #a4a4a4;" title="info@investify.africa" href="mailto:info@investify.africa">info@investify.africa</a> because you created an account on &nbsp; <a style="text-decoration: underline; color: #a4a4a4;" href="https://investify.africa" target="_blank" rel="noopener">investify.africa</a> .&nbsp;</span></p>
                                                <p style="font-size: 13px; line-height: 1.5; word-break: break-word; text-align: center; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 20px; mso-ansi-font-size: 14px; margin: 0;"><span style="font-size: 13px; mso-ansi-font-size: 14px;">&nbsp;&nbsp; &copy; 2020 Investify Africa | Lagos, Nigeria</span></p>
                                              </div>
                                            </div>
                    
                                            <!--[if mso]></td></tr></table><![endif]-->
                    
                                            <!--[if (!mso)&(!IE)]>
                    <!-->
                                          </div>
                    
                                          <!--<![endif]-->
                                        </div>
                                      </div>
                    
                                      <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                    
                                      <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                    </div>
                                  </div>
                                </div>
                                <div style="background-color:#38383b;">
                                  <div class="block-grid " style="Margin: 0 auto; min-width: 320px; max-width: 650px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
                                    <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                    
                                      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#38383b;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                    
                                      <!--[if (mso)|(IE)]><td align="center" width="650" style="background-color:transparent;width:650px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                                      <div class="col num12" style="min-width: 320px; max-width: 650px; display: table-cell; vertical-align: top; width: 650px;">
                                        <div style="width:100% !important;">
                    
                                          <!--[if (!mso)&(!IE)]>
                    <!-->
                                          <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                    
                                            <!--<![endif]-->
                    
                                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
                                            <div style="color:#8a3b8f;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.5;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                              <div style="font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; font-size: 12px; line-height: 1.5; color: #8a3b8f; mso-line-height-alt: 18px;">
                                                <p style="font-size: 14px; line-height: 1.5; word-break: break-word; text-align: center; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 21px; margin: 0;"><a style="text-decoration: none; color: #ffffff;" href="http://bee.musvc2.net/e/t?q=7%3dOVLbO%26D%3dF%26H%3dKYHU%267%3dYEWKW%268%3dBBL3M_0sft_K3_5ukr_E0_0sft_J8o9w859w.A2_Liuc_Vx_Jdwh_UsOBE_6ICJp9_0sft_K6rGsAy_8wKvA6_4yIy_Jdwh_TIOBE_z9vA8G_0sft_K6rGsAy_Liuc_VNM7G_u3zJsAtH_0sft_K609452Gw-7z51D-q9AAtH-tD2A-wEnC4-52HxA5GsL5s3nvI6%266%3dzOANpV.677%26CA%3dUFYNbE" target="_blank" rel="noopener">Made with&nbsp;❤ by Likelier</a></p>
                                              </div>
                                            </div>
                    
                                            <!--[if mso]></td></tr></table><![endif]-->
                    
                                            <!--[if (!mso)&(!IE)]>
                    <!-->
                                          </div>
                    
                                          <!--<![endif]-->
                                        </div>
                                      </div>
                    
                                      <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                    
                                      <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                    </div>
                                  </div>
                                </div>
                    
                                <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                              </td>
                            </tr>
                          </tbody>
                        </table>
                    
                        <!--[if (IE)]></div><![endif]-->
                      </body>
                    </html>`
                }

                passwordTransporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error)
                        return res.status(422).json(error)
                    } else {
                        console.log('Email sent: ' + info.response)
                        res.json({message:"check your email address"})
                    }
                })
                
            })

        }).catch(err=>{
            console.log(err)
        })
    })
})

module.exports = router